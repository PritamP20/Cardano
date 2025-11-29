"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  GraduationCap,
  IndianRupee,
  Search,
  Edit,
  Trash,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import InstructorSidebar from "@/components/instructor/Sidebar";
import InstructorHeader from "@/components/instructor/Header";
import useAxios from "@/utils/axios";
import UserData from "@/views/plugins/UserData";
import Toast from "@/views/plugins/Toast";

interface Stats {
  total_courses: number;
  total_students: number;
  total_revenue: number;
}

interface Student {
  id: string;
  name: string;
}

interface Course {
  id: string;
  course_id: string;
  slug?: string; // Add the slug property
  title: string;
  image: string;
  language: string;
  level: string;
  price: number;
  students: Student[];
  date: string;
  platform_status: "Review" | "Reject" | "Disabled" | "Draft" | "Published";
  teacher_course_status: "Disabled" | "Draft" | "Published";
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total_courses: 0,
    total_students: 0,
    total_revenue: 0,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, coursesRes] = await Promise.all([
        useAxios.get(`teacher/summary/${UserData()?.teacher_id}/`),
        useAxios.get(`teacher/course-lists/${UserData()?.teacher_id}/`),
      ]);
      setStats(statsRes.data[0]);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteClick = (course: Course) => {
    setDeletingCourse(course);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCourse) return;

    setIsDeleting(true);
    try {
      // Make the delete API call using the slug
      await useAxios.delete(`course/course-detail/${deletingCourse.slug}/`);

      // Remove the course from the state
      setCourses(
        courses.filter(
          (course) => course.course_id !== deletingCourse.course_id
        )
      );

      // Show success message
      Toast().fire({
        title: `Course "${deletingCourse.title}" deleted successfully`,
        icon: "success",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      Toast().fire({
        title: "Failed to delete course",
        icon: "error",
      });
    } finally {
      // Reset state
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeletingCourse(null);
    }
  };
  useEffect(() => {
    fetchCourseData();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      fetchCourseData();
    } else {
      const filtered = courses.filter((c) =>
        c.title.toLowerCase().includes(query)
      );
      setCourses(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <InstructorHeader />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mt-4 sm:mt-8">
          <div className="lg:sticky lg:top-4 lg:self-start">
            <InstructorSidebar />
          </div>

          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            <motion.div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">Dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  Manage your courses and view insights
                </p>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-card border-border hover:border-secondary/50 transition-colors shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-primary/5 rounded-lg">
                      <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Courses
                      </p>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                        {stats.total_courses}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-secondary/50 transition-colors shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg">
                      <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Students
                      </p>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                        {stats.total_students}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-secondary/50 transition-colors shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg">
                      <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Revenue
                      </p>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                        ₹{stats.total_revenue?.toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Courses Table */}
            <Card className="border-border overflow-hidden bg-card shadow-sm">
              <CardHeader className="p-4 sm:p-6 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl text-foreground">
                      Courses
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage your courses from here, search, view, edit or
                      delete courses.
                    </p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search your courses..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="pl-10 border-input focus:border-secondary"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary" />
                  </div>
                ) : courses.length > 0 ? (
                  <div>
                    {/* Desktop and Tablet View */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                          <tr>
                            <th className="px-6 py-3 text-left">Courses</th>
                            <th className="px-6 py-3 text-left">Enrolled</th>
                            <th className="px-6 py-3 text-left">Level</th>
                            <th className="px-6 py-3 text-left">
                              Platform Status
                            </th>
                            <th className="px-6 py-3 text-left">
                              Course Status
                            </th>
                            <th className="px-6 py-3 text-left">
                              Date Created
                            </th>
                            <th className="px-6 py-3 text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {courses.map((course) => (
                            <motion.tr
                              key={course.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="bg-card hover:bg-muted/50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border">
                                    <Image
                                      src={course.image}
                                      alt={course.title}
                                      width={96}
                                      height={64}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-foreground">
                                      {course.title}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                                      <span>{course.language}</span>
                                      <span>•</span>
                                      <span>{course.level}</span>
                                      <span>•</span>
                                      <span>₹{course.price}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-foreground">
                                {course.students?.length || 0}
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  variant="outline"
                                  className="bg-secondary/10 text-secondary border-secondary/20"
                                >
                                  {course.level}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  variant="outline"
                                  className={`${course.platform_status === "Published"
                                      ? "bg-green-500/10 text-green-600 border-green-500/20"
                                      : course.platform_status === "Review"
                                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                        : course.platform_status === "Draft"
                                          ? "bg-gray-500/10 text-gray-600 border-gray-500/20"
                                          : course.platform_status === "Reject"
                                            ? "bg-red-500/10 text-red-600 border-red-500/20"
                                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                    }`}
                                >
                                  {course.platform_status || "Unknown"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  variant="outline"
                                  className={`${course.teacher_course_status === "Published"
                                      ? "bg-green-500/10 text-green-600 border-green-500/20"
                                      : course.teacher_course_status === "Draft"
                                        ? "bg-gray-500/10 text-gray-600 border-gray-500/20"
                                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                    }`}
                                >
                                  {course.teacher_course_status || "Unknown"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                {format(new Date(course.date), "dd MMM, yyyy")}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2 pt-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-secondary"
                                    asChild
                                  >
                                    <Link
                                      href={`/instructor/edit-course/${course.course_id}/`}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                                    onClick={() => handleDeleteClick(course)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile View */}
                    <div className="sm:hidden p-4">
                      {courses.map((course) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-card border border-border shadow-sm p-4 mb-3 rounded-lg"
                        >
                          <div className="flex items-start space-x-3 mb-3">
                            <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border">
                              <Image
                                src={course.image}
                                alt={course.title}
                                width={96}
                                height={64}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="font-medium text-foreground">
                                {course.title}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                                <span>{course.language}</span>
                                <span>•</span>
                                <span>{course.level}</span>
                                <span>•</span>
                                <span>₹{course.price}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div>
                              <span className="text-muted-foreground block">
                                Enrolled:
                              </span>
                              <span className="font-medium text-foreground">
                                {course.students?.length || 0}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block">Date:</span>
                              <span className="font-medium text-foreground">
                                {format(new Date(course.date), "dd MMM, yyyy")}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <div>
                              <span className="text-muted-foreground text-xs block mb-1">
                                Platform:
                              </span>
                              <Badge
                                variant="outline"
                                className={`${course.platform_status === "Published"
                                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                                    : course.platform_status === "Review"
                                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                      : course.platform_status === "Draft"
                                        ? "bg-gray-500/10 text-gray-600 border-gray-500/20"
                                        : course.platform_status === "Reject"
                                          ? "bg-red-500/10 text-red-600 border-red-500/20"
                                          : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                  }`}
                              >
                                {course.platform_status || "Unknown"}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-xs block mb-1">
                                Status:
                              </span>
                              <Badge
                                variant="outline"
                                className={`${course.teacher_course_status === "Published"
                                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                                    : course.teacher_course_status === "Draft"
                                      ? "bg-gray-500/10 text-gray-600 border-gray-500/20"
                                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                  }`}
                              >
                                {course.teacher_course_status || "Unknown"}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex space-x-2 pt-2 border-t border-border">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-foreground hover:text-secondary"
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-red-600 hover:bg-red-50"
                            >
                              <Trash className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card rounded-lg">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium text-foreground">
                      No courses found
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create your first course to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Course
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">{deletingCourse?.title}</span>?
              <p className="mt-2 text-destructive">
                This action cannot be undone. All course content, lectures, and
                materials will be permanently removed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="border-border text-foreground hover:bg-muted">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                "Delete Course"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
