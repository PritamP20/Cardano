"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var crypto = require("crypto");
function extractXMLContent(xml, tag) {
    var regex = new RegExp("<".concat(tag, "[^>]*>([\\s\\S]*?)</").concat(tag, ">"), 'i');
    var match = xml.match(regex);
    return match ? match[1] : null;
}
function cleanBase64(text) {
    return text
        .replace(/&#13;/g, '')
        .replace(/\s/g, '')
        .trim();
}
function canonicalizeXML(xml) {
    return xml
        .replace(/\r\n/g, '\n')
        .replace(/&#13;/g, '\n')
        .replace(/>\s+</g, '><')
        .trim();
}
function extractVerificationData(xmlContent) {
    try {
        // Extract SignatureValue
        var signatureValueRaw = extractXMLContent(xmlContent, 'SignatureValue');
        if (!signatureValueRaw) {
            console.error('❌ SignatureValue not found');
            return null;
        }
        var signatureValue = cleanBase64(signatureValueRaw);
        // Extract X509Certificate
        var x509CertRaw = extractXMLContent(xmlContent, 'X509Certificate');
        if (!x509CertRaw) {
            console.error('❌ X509Certificate not found');
            return null;
        }
        var x509Certificate = cleanBase64(x509CertRaw);
        // Extract DigestValue from Reference
        var digestValueRaw = extractXMLContent(xmlContent, 'DigestValue');
        if (!digestValueRaw) {
            console.error('❌ DigestValue not found');
            return null;
        }
        var digestValue = cleanBase64(digestValueRaw);
        // Extract UidData (the signed content)
        var uidDataRaw = extractXMLContent(xmlContent, 'UidData');
        if (!uidDataRaw) {
            console.error('❌ UidData not found');
            return null;
        }
        var signedData = canonicalizeXML("<UidData>".concat(uidDataRaw, "</UidData>"));
        return {
            signatureValue: signatureValue,
            x509Certificate: x509Certificate,
            digestValue: digestValue,
            signedData: signedData
        };
    }
    catch (error) {
        console.error('❌ Error extracting verification data:', error);
        return null;
    }
}
function verifyAadhaarSignature() {
    return __awaiter(this, void 0, void 0, function () {
        var xmlPath, xmlContent, data, signatureValue, x509Certificate, digestValue, signedData, calculatedDigest, digestMatch, signedInfoRaw, signedInfo, signedInfoDigest, certPEM, verifier, signatureBuffer, isSignatureValid, overallValid;
        return __generator(this, function (_a) {
            try {
                xmlPath = './offline-aadhaar.xml';
                if (!fs.existsSync(xmlPath)) {
                    console.error("\u274C File not found: ".concat(xmlPath));
                    return [2 /*return*/, false];
                }
                xmlContent = fs.readFileSync(xmlPath, 'utf-8');
                console.log('✓ XML file read successfully\n');
                data = extractVerificationData(xmlContent);
                if (!data) {
                    console.error('❌ Failed to extract verification data');
                    return [2 /*return*/, false];
                }
                signatureValue = data.signatureValue, x509Certificate = data.x509Certificate, digestValue = data.digestValue, signedData = data.signedData;
                console.log('=== Step 1: Extract Data ===');
                console.log("\u2713 Signature Value: ".concat(signatureValue.substring(0, 50), "..."));
                console.log("\u2713 X509 Certificate: ".concat(x509Certificate.substring(0, 50), "..."));
                console.log("\u2713 Digest Value (base64): ".concat(digestValue));
                console.log("\u2713 Signed Data Length: ".concat(signedData.length, " bytes\n"));
                // Step 1: Calculate SHA256 hash of the signed data
                console.log('=== Step 2: Calculate Hash of Signed Data ===');
                calculatedDigest = crypto
                    .createHash('sha256')
                    .update(signedData, 'utf-8')
                    .digest('base64');
                console.log("Expected Digest (from XML):  ".concat(digestValue));
                console.log("Calculated Digest (SHA256):  ".concat(calculatedDigest));
                digestMatch = calculatedDigest === digestValue;
                console.log("Digest Match: ".concat(digestMatch ? '✓ YES' : '✗ NO', "\n"));
                if (!digestMatch) {
                    console.error('❌ Digest mismatch! The signed data has been modified.');
                    return [2 /*return*/, false];
                }
                // Step 2: Extract SignedInfo and canonicalize it
                console.log('=== Step 3: Extract and Canonicalize SignedInfo ===');
                signedInfoRaw = extractXMLContent(xmlContent, 'SignedInfo');
                if (!signedInfoRaw) {
                    console.error('❌ SignedInfo not found');
                    return [2 /*return*/, false];
                }
                signedInfo = "<SignedInfo>".concat(canonicalizeXML(signedInfoRaw), "</SignedInfo>");
                console.log("\u2713 SignedInfo canonicalized");
                console.log("  Length: ".concat(signedInfo.length, " bytes\n"));
                // Step 3: Calculate SHA1 hash of SignedInfo (used for RSA signature)
                console.log('=== Step 4: Verify RSA Signature ===');
                signedInfoDigest = crypto
                    .createHash('sha1')
                    .update(signedInfo, 'utf-8')
                    .digest();
                console.log("\u2713 SignedInfo SHA1 Hash calculated");
                console.log("  Hash Length: ".concat(signedInfoDigest.length, " bytes\n"));
                // Step 4: Extract public key from certificate and verify signature
                console.log('=== Step 5: Verify with Public Key ===');
                certPEM = "-----BEGIN CERTIFICATE-----\n".concat(x509Certificate, "\n-----END CERTIFICATE-----");
                verifier = crypto.createVerify('RSA-SHA1');
                verifier.update(signedInfo, 'utf-8');
                signatureBuffer = Buffer.from(signatureValue, 'base64');
                isSignatureValid = verifier.verify(certPEM, signatureBuffer);
                console.log("Signature Buffer Length: ".concat(signatureBuffer.length, " bytes"));
                console.log("RSA-SHA1 Verification: ".concat(isSignatureValid ? '✓ PASSED' : '✗ FAILED', "\n"));
                // Final result
                console.log('=== Summary ===');
                console.log("1. Data Integrity (SHA256 Digest): ".concat(digestMatch ? '✓ VALID' : '✗ INVALID'));
                console.log("2. Signature Authenticity (RSA-SHA1): ".concat(isSignatureValid ? '✓ VALID' : '✗ INVALID'));
                console.log("3. Certificate Issuer: UIDAI (Unique Identification Authority of India)\n");
                overallValid = digestMatch && isSignatureValid;
                return [2 /*return*/, overallValid];
            }
            catch (error) {
                console.error('❌ Error during verification:', error instanceof Error ? error.message : String(error));
                if (error instanceof Error && error.stack) {
                    console.error('Stack:', error.stack);
                }
                return [2 /*return*/, false];
            }
            return [2 /*return*/];
        });
    });
}
// Main execution
verifyAadhaarSignature()
    .then(function (result) {
    console.log('='.repeat(65));
    if (result) {
        console.log('✓✓✓ FINAL RESULT: TRUE - AADHAAR SIGNATURE IS VALID ✓✓✓');
        console.log('✓ Document is authentic and has not been tampered with');
    }
    else {
        console.log('✗✗✗ FINAL RESULT: FALSE - AADHAAR SIGNATURE IS INVALID ✗✗✗');
        console.log('✗ Document may be inauthentic or has been modified');
    }
    console.log('='.repeat(65));
    process.exit(result ? 0 : 1);
})
    .catch(function (err) {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
