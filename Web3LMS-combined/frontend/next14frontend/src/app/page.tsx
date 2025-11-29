"use client";

import { useAuthStore } from "@/store/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import apiInstance from "@/utils/axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ShieldCheck,
  GraduationCap,
  Globe,
  Rocket,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Code2,
  Cpu,
  Layers,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  category: {
    id: number;
    title: string;
    image: string;
    active: boolean;
    slug: string;
  };
  teacher: {
    id: number;
    image: string;
    full_name: string;
    bio: string | null;
    facebook: string | null;
    twitter: string | null;
    linkedin: string | null;
    about: string;
    country: string | null;
    user: {
      id: number;
      password: string;
      last_login: string;
      is_superuser: boolean;
      first_name: string;
      last_name: string;
      is_staff: boolean;
      is_active: boolean;
      date_joined: string;
      username: string;
      email: string;
      full_name: string;
      otp: string | null;
      refresh_token: string | null;
    };
  };
  file: string | null;
  image: string | null;
  title: string;
  description: string;
  price: string;
  language: string;
  level: string;
  platform_status: string;
  teacher_course_status: string;
  featured: boolean;
  course_id: string;
  slug: string;
  date: string;
  students: {
    id: number;
  }[];
  average_rating: number | null;
  rating_count: number;
  reviews: {
    id: number;
  }[];
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const handleCourseClick = (slug: string) => {
    if (isLoggedIn()) {
      router.push(`/course-details/${slug}`);
    } else {
      router.push('/unauthorized');
    }
  };

  const fetchCourse = async () => {
    setIsLoading(true);
    try {
      const res = await apiInstance.get(`/course/course-list/`);
      console.log("Courses fetched successfully:", res.data);
      const featuredCourses = res.data.filter((course: Course) => course.featured);
      setCourses(featuredCourses);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary mb-6"
              >
                <Zap className="h-4 w-4 fill-secondary" />
                <span className="text-sm font-semibold">The Future of Web3 Education</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-foreground">
                Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-600">Blockchain</span> <br />
                Build the Future
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                Join the premier decentralized learning platform. Earn verifiable on-chain credentials while mastering Smart Contracts, DeFi, and Zero-Knowledge Proofs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground h-14 px-8 text-lg rounded-full shadow-lg shadow-secondary/20 transition-all hover:scale-105"
                  onClick={() => router.push("/courses")}
                >
                  Start Learning Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-full border-2 hover:bg-muted/50 transition-all hover:scale-105"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  View Demo
                </Button>
              </div>

              <div className="mt-12 flex items-center gap-8 text-muted-foreground">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted relative overflow-hidden">
                      <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Rater total={5} rating={5} interactive={false} />
                  </div>
                  <p className="text-sm font-medium"><span className="text-foreground font-bold">150k+</span> Students Enrolled</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{ y: y1 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-card border border-border rounded-2xl p-6 shadow-2xl shadow-secondary/10 rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="absolute -top-12 -right-12 bg-secondary text-secondary-foreground p-4 rounded-xl shadow-lg animate-bounce">
                  <Code2 className="h-8 w-8" />
                </div>
                <Image
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
                  alt="Web3 Learning"
                  width={600}
                  height={400}
                  className="rounded-xl object-cover"
                />
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Cpu className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">Solidity Masterclass</h3>
                        <p className="text-sm text-muted-foreground">Advanced Smart Contracts</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">In Progress</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full w-[75%]" />
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                style={{ y: y2 }}
                className="absolute -bottom-10 -left-10 bg-card p-4 rounded-xl shadow-xl border border-border max-w-xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="h-8 w-8 text-green-500" />
                  <div>
                    <h4 className="font-bold text-foreground">Verified Certificate</h4>
                    <p className="text-xs text-muted-foreground">Minted on Polygon</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Students", value: "150K+", icon: Users },
              { label: "Expert Mentors", value: "200+", icon: GraduationCap },
              { label: "Courses", value: "500+", icon: BookOpen },
              { label: "Countries", value: "120+", icon: Globe },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-secondary/10 rounded-xl">
                    <stat.icon className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Bento Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Why Choose Decentralized Learning?</h2>
          <p className="text-xl text-muted-foreground">Experience the next evolution of education with blockchain-verified credentials and community-driven curriculum.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Large Feature */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-secondary/20" />
            <div className="relative z-10">
              <div className="bg-secondary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Immutable On-Chain Certificates</h3>
              <p className="text-muted-foreground text-lg mb-6 max-w-md">
                Your achievements are minted as NFTs on the blockchain. Verifiable, permanent, and owned by you. Share your credentials with confidence.
              </p>
              <Image
                src="https://images.unsplash.com/photo-1620325867502-221cfb5faa5f?q=80&w=2957&auto=format&fit=crop"
                alt="NFT Certificate"
                width={400}
                height={200}
                className="rounded-xl shadow-lg border border-border/50"
              />
            </div>
          </motion.div>

          {/* Tall Feature */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:row-span-2 bg-gradient-to-b from-primary to-primary/90 rounded-3xl p-8 border border-primary/20 shadow-sm hover:shadow-xl transition-all text-primary-foreground relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Career Launchpad</h3>
              <p className="text-white/80 mb-8 flex-grow">
                Direct integration with top Web3 hiring partners. Get discovered by leading protocols and DAOs based on your verified skill set.
              </p>
              <div className="space-y-4">
                {["DeFi Protocols", "NFT Marketplaces", "L1/L2 Chains", "Audit Firms"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm">
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Small Feature 1 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">DAO Governance</h3>
            <p className="text-muted-foreground">
              Participate in platform governance. Vote on new courses and curriculum updates.
            </p>
          </motion.div>

          {/* Small Feature 2 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Global Community</h3>
            <p className="text-muted-foreground">
              Connect with developers from 120+ countries. Collaborate on hackathons and projects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Explore Top Categories</h2>
              <p className="text-muted-foreground">Find the perfect path for your Web3 journey</p>
            </div>
            <Button variant="ghost" className="hidden md:flex gap-2 text-secondary hover:text-secondary/80">
              View All Categories <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Smart Contracts', icon: Code2, count: "24 Courses", color: "text-blue-500", bg: "bg-blue-500/10" },
              { name: 'DeFi Development', icon: Layers, count: "18 Courses", color: "text-green-500", bg: "bg-green-500/10" },
              { name: 'NFTs & Metaverse', icon: Rocket, count: "12 Courses", color: "text-purple-500", bg: "bg-purple-500/10" },
              { name: 'Blockchain Security', icon: ShieldCheck, count: "15 Courses", color: "text-red-500", bg: "bg-red-500/10" },
            ].map((category, idx) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-card p-6 rounded-2xl border border-border hover:border-secondary/50 transition-all cursor-pointer group"
                onClick={() => router.push(`/courses?category=${category.name.toLowerCase()}`)}
              >
                <div className={`${category.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className={`h-7 w-7 ${category.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-1 text-foreground group-hover:text-secondary transition-colors">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Carousel */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="outline" className="mb-4 border-secondary text-secondary">Top Rated</Badge>
          <h2 className="text-4xl font-bold mb-4 text-foreground">Featured Courses</h2>
          <p className="text-muted-foreground max-w-2xl">
            Hand-picked courses from our top instructors to help you master the most in-demand skills.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {courses.map((course) => (
                  <CarouselItem key={course.course_id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                      <Card className="h-full flex flex-col overflow-hidden border-border hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-300 group bg-card">
                        <div
                          className="relative aspect-[4/3] cursor-pointer overflow-hidden"
                          onClick={() => handleCourseClick(course.slug)}
                        >
                          <Image
                            src={course.image || "/placeholder-course.jpg"}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/50 rounded-full">
                              View Course
                            </Button>
                          </div>
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90">
                              {course.level}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-0">
                              {course.category.title}
                            </Badge>
                            <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                              <Zap className="h-3 w-3 fill-yellow-500" />
                              {course.average_rating || 4.8}
                            </div>
                          </div>
                          <CardTitle
                            className="text-lg font-bold line-clamp-2 hover:text-secondary transition-colors cursor-pointer text-foreground"
                            onClick={() => handleCourseClick(course.slug)}
                          >
                            {course.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="p-5 pt-0 flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-8 w-8 border border-border">
                              <AvatarImage src={course.teacher.image} />
                              <AvatarFallback>{course.teacher.full_name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground line-clamp-1">
                              By <span className="text-foreground font-medium">{course.teacher.full_name}</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {course.students.length} students
                            </div>
                            <div className="flex items-center gap-1">
                              <PlayCircle className="h-4 w-4" />
                              12 Lessons
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-5 pt-0">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-2xl font-bold text-foreground">
                              ₹{course.price}
                            </span>
                            <Button size="sm" variant="outline" className="hover:bg-secondary hover:text-white hover:border-secondary transition-colors" onClick={() => handleCourseClick(course.slug)}>
                              Enroll
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 h-12 w-12 border-border hover:bg-secondary hover:text-white hover:border-secondary" />
              <CarouselNext className="hidden md:flex -right-12 h-12 w-12 border-border hover:bg-secondary hover:text-white hover:border-secondary" />
            </Carousel>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4 mb-12">
        <div className="bg-primary rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-secondary/20 to-transparent" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary-foreground">Ready to Start Your Web3 Journey?</h2>
            <p className="text-xl text-primary-foreground/80 mb-10">
              Join thousands of developers building the future of the internet. Get unlimited access to all courses with our Pro plan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white h-14 px-8 text-lg rounded-full">
                Get Started for Free
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10 h-14 px-8 text-lg rounded-full">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}