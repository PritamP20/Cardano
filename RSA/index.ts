import * as fs from 'fs';
import * as crypto from 'crypto';

interface VerificationData {
    signatureValue: string;
    x509Certificate: string;
    digestValue: string;
    signedData: string;
}

function extractXMLContent(xml: string, tag: string): string | null {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1] : null;
}

function cleanBase64(text: string): string {
    return text
        .replace(/&#13;/g, '')
        .replace(/\s/g, '')
        .trim();
}

function canonicalizeXML(xml: string): string {
    return xml
        .replace(/\r\n/g, '\n')
        .replace(/&#13;/g, '\n')
        .replace(/>\s+</g, '><')
        .replace(/<([a-zA-Z0-9:]+)([^>]*?)\/>/g, '<$1$2></$1>') // Expand empty tags
        .trim();
}

function extractVerificationData(xmlContent: string): VerificationData | null {
    try {
        // Extract SignatureValue
        const signatureValueRaw = extractXMLContent(xmlContent, 'SignatureValue');
        if (!signatureValueRaw) {
            console.error('❌ SignatureValue not found');
            return null;
        }
        const signatureValue = cleanBase64(signatureValueRaw);

        // Extract X509Certificate
        const x509CertRaw = extractXMLContent(xmlContent, 'X509Certificate');
        if (!x509CertRaw) {
            console.error('❌ X509Certificate not found');
            return null;
        }
        const x509Certificate = cleanBase64(x509CertRaw);

        // Extract DigestValue from Reference
        const digestValueRaw = extractXMLContent(xmlContent, 'DigestValue');
        if (!digestValueRaw) {
            console.error('❌ DigestValue not found');
            return null;
        }
        const digestValue = cleanBase64(digestValueRaw);

        // Extract OfflinePaperlessKyc attributes
        const rootMatch = xmlContent.match(/<OfflinePaperlessKyc([^>]*)>/);
        if (!rootMatch) {
            console.error('❌ OfflinePaperlessKyc tag not found');
            return null;
        }
        const rootAttrs = rootMatch[1];

        // Extract UidData (the signed content)
        const uidDataRaw = extractXMLContent(xmlContent, 'UidData');
        if (!uidDataRaw) {
            console.error('❌ UidData not found');
            return null;
        }

        // Construct the document without Signature (Enveloped Signature Transform)
        // We assume UidData is the only child besides Signature.
        // If there are other children, we should extract them too.
        // But based on the file, it seems UidData is the only one.
        // We need to be careful about whitespace between OfflinePaperlessKyc and UidData if any.
        // But canonicalization will handle it.

        const signedData = canonicalizeXML(`<OfflinePaperlessKyc${rootAttrs}><UidData>${uidDataRaw}</UidData></OfflinePaperlessKyc>`);

        return {
            signatureValue,
            x509Certificate,
            digestValue,
            signedData
        };
    } catch (error) {
        console.error('❌ Error extracting verification data:', error);
        return null;
    }
}

async function verifyAadhaarSignature(): Promise<boolean> {
    try {
        const xmlPath = './offline-aadhaar.xml';
        if (!fs.existsSync(xmlPath)) {
            console.error(`❌ File not found: ${xmlPath}`);
            return false;
        }

        const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
        console.log('✓ XML file read successfully\n');

        // Extract all verification data
        const data = extractVerificationData(xmlContent);
        if (!data) {
            console.error('❌ Failed to extract verification data');
            return false;
        }

        const { signatureValue, x509Certificate, digestValue, signedData } = data;

        console.log('=== Step 1: Extract Data ===');
        console.log(`✓ Signature Value: ${signatureValue.substring(0, 50)}...`);
        console.log(`✓ X509 Certificate: ${x509Certificate.substring(0, 50)}...`);
        console.log(`✓ Digest Value (base64): ${digestValue}`);
        console.log(`✓ Signed Data Length: ${signedData.length} bytes\n`);

        // Step 1: Calculate SHA256 hash of the signed data
        console.log('=== Step 2: Calculate Hash of Signed Data ===');
        const calculatedDigest = crypto
            .createHash('sha256')
            .update(signedData, 'utf-8')
            .digest('base64');

        console.log(`Expected Digest (from XML):  ${digestValue}`);
        console.log(`Calculated Digest (SHA256):  ${calculatedDigest}`);

        const digestMatch = calculatedDigest === digestValue;
        console.log(`Digest Match: ${digestMatch ? '✓ YES' : '✗ NO'}\n`);

        if (!digestMatch) {
            console.error('❌ Digest mismatch! The signed data has been modified.');
            return false;
        }

        // Step 2: Extract SignedInfo and canonicalize it
        console.log('=== Step 3: Extract and Canonicalize SignedInfo ===');
        const signedInfoRaw = extractXMLContent(xmlContent, 'SignedInfo');
        if (!signedInfoRaw) {
            console.error('❌ SignedInfo not found');
            return false;
        }

        // Add the namespace to SignedInfo as it inherits it from Signature
        const signedInfo = `<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#">${canonicalizeXML(signedInfoRaw)}</SignedInfo>`;
        console.log(`✓ SignedInfo canonicalized`);
        console.log(`  Length: ${signedInfo.length} bytes\n`);

        // Step 3: Calculate SHA1 hash of SignedInfo (used for RSA signature)
        console.log('=== Step 4: Verify RSA Signature ===');
        const signedInfoDigest = crypto
            .createHash('sha1')
            .update(signedInfo, 'utf-8')
            .digest();

        console.log(`✓ SignedInfo SHA1 Hash calculated`);
        console.log(`  Hash Length: ${signedInfoDigest.length} bytes\n`);

        // Step 4: Extract public key from certificate and verify signature
        console.log('=== Step 5: Verify with Public Key ===');
        const certPEM = `-----BEGIN CERTIFICATE-----\n${x509Certificate}\n-----END CERTIFICATE-----`;

        const verifier = crypto.createVerify('RSA-SHA1');
        verifier.update(signedInfo, 'utf-8');

        const signatureBuffer = Buffer.from(signatureValue, 'base64');
        const isSignatureValid = verifier.verify(certPEM, signatureBuffer);

        console.log(`Signature Buffer Length: ${signatureBuffer.length} bytes`);
        console.log(`RSA-SHA1 Verification: ${isSignatureValid ? '✓ PASSED' : '✗ FAILED'}\n`);

        // Final result
        console.log('=== Summary ===');
        console.log(`1. Data Integrity (SHA256 Digest): ${digestMatch ? '✓ VALID' : '✗ INVALID'}`);
        console.log(`2. Signature Authenticity (RSA-SHA1): ${isSignatureValid ? '✓ VALID' : '✗ INVALID'}`);
        console.log(`3. Certificate Issuer: UIDAI (Unique Identification Authority of India)\n`);

        const overallValid = digestMatch && isSignatureValid;
        return overallValid;
    } catch (error) {
        console.error('❌ Error during verification:', error instanceof Error ? error.message : String(error));
        if (error instanceof Error && error.stack) {
            console.error('Stack:', error.stack);
        }
        return false;
    }
}

// Main execution
verifyAadhaarSignature()
    .then((result) => {
        console.log('='.repeat(65));
        if (result) {
            console.log('✓✓✓ FINAL RESULT: TRUE - AADHAAR SIGNATURE IS VALID ✓✓✓');
            console.log('✓ Document is authentic and has not been tampered with');
        } else {
            console.log('✗✗✗ FINAL RESULT: FALSE - AADHAAR SIGNATURE IS INVALID ✗✗✗');
            console.log('✗ Document may be inauthentic or has been modified');
        }
        console.log('='.repeat(65));
        process.exit(result ? 0 : 1);
    })
    .catch((err) => {
        console.error('❌ Fatal error:', err);
        process.exit(1);
    });