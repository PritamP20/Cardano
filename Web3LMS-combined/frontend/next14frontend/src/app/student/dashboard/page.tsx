"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, Award, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useAxios from "@/utils/axios";
import UserData from "@/views/plugins/UserData";
import StudentHeader from "@/components/student/Header";
import StudentSidebar from "@/components/student/Sidebar";

interface Course {
  enrollment_id: string;
  course: {
    title: string;
    image: string;
    language: string;
    level: string;
  };
  date: string;
  lectures: {
    id: string;
    title: string;
  }[];
  completed_lesson: {
    id: string;
    lesson_id: string;
  }[];
}

interface Stats {
  total_courses: number;
  completed_lessons: number;
  achieved_certificates: number;
}

function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_courses: 0,
    completed_lessons: 0,
    achieved_certificates: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, coursesRes] = await Promise.all([
        useAxios.get(`student/summary/${UserData()?.user_id}/`),
        useAxios.get(`student/course-list/${UserData()?.user_id}/`),
      ]);
      setStats(statsRes.data[0]);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      fetchData();
    } else {
      const filtered = courses.filter((c) =>
        c.course.title.toLowerCase().includes(query)
      );
      setCourses(filtered);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <StudentHeader />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mt-4 sm:mt-8">
          <div className="lg:sticky lg:top-4 lg:self-start">
            <StudentSidebar />
          </div>

          <div className="lg:col-span-3 space-y-5 sm:space-y-7">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">Dashboard</h4>
                <p className="text-sm text-muted-foreground">Track your learning progress and courses</p>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <Card className="bg-card border-border hover:border-secondary/50 transition-colors shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg">
                      <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">{stats.total_courses}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-secondary/50 transition-colors shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-primary/5 rounded-lg">
                      <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed Lessons</p>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">{stats.completed_lessons}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-secondary/50 transition-colors shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg">
                      <Award className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Certificates</p>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">{stats.achieved_certificates}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Courses Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="border-border overflow-hidden bg-card shadow-sm">
                <CardHeader className="p-5 sm:p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg sm:text-xl text-foreground">My Courses</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Continue learning from where you left off
                      </p>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-10 border-input focus:border-secondary"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary" />
                    </div>
                  ) : courses.length > 0 ? (
                    <div className="space-y-4">
                      {courses.map((course, index) => (
                        <motion.div
                          key={course.enrollment_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-0 bg-card sm:bg-transparent rounded-lg border border-border sm:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <div className="relative h-32 sm:h-20 w-full sm:w-32 flex-shrink-0">
                            <Image
                              src={course.course.image}
                              alt={course.course.title}
                              fill
                              className="rounded-lg object-cover border border-border"
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-foreground">{course.course.title}</h4>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-sm text-muted-foreground">
                              <span>{course.course.language}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>{course.course.level}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>{course.lectures.length} lessons</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                            <div className="text-sm text-muted-foreground">
                              {course.completed_lesson.length} completed
                            </div>
                            <Button
                              variant={course.completed_lesson.length > 0 ? "default" : "outline"}
                              size="sm"
                              asChild
                              className={cn(
                                "w-full sm:w-auto",
                                course.completed_lesson.length > 0
                                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                  : "border-secondary text-secondary hover:bg-secondary/10"
                              )}
                            >
                              <Link href={`/student/course/${course.enrollment_id}/`}>
                                {course.completed_lesson.length > 0 ? "Continue" : "Start"} Course
                              </Link>
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No courses found
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
