"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiInstance from "@/utils/axios";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";
import { motion } from "framer-motion";
import { Search, Filter, BookOpen, Users, Clock, Star } from "lucide-react";

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
    students: { id: number }[];
    average_rating: number | null;
    rating_count: number;
    reviews: { id: number }[];
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLevel, setSelectedLevel] = useState<string>("all");
    const router = useRouter();

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const res = await apiInstance.get(`/course/course-list/`);
            setCourses(res.data);
            setFilteredCourses(res.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        let filtered = courses;

        if (searchQuery) {
            filtered = filtered.filter((course) =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedLevel !== "all") {
            filtered = filtered.filter((course) => course.level === selectedLevel);
        }

        setFilteredCourses(filtered);
    }, [searchQuery, selectedLevel, courses]);

    const handleCourseClick = (slug: string) => {
        router.push(`/course-details/${slug}`);
    };

    const handleEnrollClick = (e: React.MouseEvent, course: Course) => {
        e.stopPropagation();
        // Navigate to course details for enrollment/purchase
        router.push(`/course-details/${course.slug}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-buttonsCustom-800 to-buttonsCustom-900 text-white py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore All Courses</h1>
                        <p className="text-lg text-buttonsCustom-100 max-w-2xl">
                            Discover blockchain and Web3 courses taught by industry experts. Enroll now and start your learning journey!
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-buttonsCustom-200/30">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-buttonsCustom-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-buttonsCustom-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-buttonsCustom-500 bg-white"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={selectedLevel === "all" ? "default" : "outline"}
                                onClick={() => setSelectedLevel("all")}
                                className={`rounded-xl ${selectedLevel === "all" ? "bg-buttonsCustom-600 hover:bg-buttonsCustom-700" : "border-buttonsCustom-300 text-buttonsCustom-700 hover:bg-buttonsCustom-50"}`}
                            >
                                All Levels
                            </Button>
                            <Button
                                variant={selectedLevel === "beginner" ? "default" : "outline"}
                                onClick={() => setSelectedLevel("beginner")}
                                className={`rounded-xl ${selectedLevel === "beginner" ? "bg-buttonsCustom-600 hover:bg-buttonsCustom-700" : "border-buttonsCustom-300 text-buttonsCustom-700 hover:bg-buttonsCustom-50"}`}
                            >
                                Beginner
                            </Button>
                            <Button
                                variant={selectedLevel === "intermediate" ? "default" : "outline"}
                                onClick={() => setSelectedLevel("intermediate")}
                                className={`rounded-xl ${selectedLevel === "intermediate" ? "bg-buttonsCustom-600 hover:bg-buttonsCustom-700" : "border-buttonsCustom-300 text-buttonsCustom-700 hover:bg-buttonsCustom-50"}`}
                            >
                                Intermediate
                            </Button>
                            <Button
                                variant={selectedLevel === "advanced" ? "default" : "outline"}
                                onClick={() => setSelectedLevel("advanced")}
                                className={`rounded-xl ${selectedLevel === "advanced" ? "bg-buttonsCustom-600 hover:bg-buttonsCustom-700" : "border-buttonsCustom-300 text-buttonsCustom-700 hover:bg-buttonsCustom-50"}`}
                            >
                                Advanced
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buttonsCustom-600"></div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredCourses.length === 0 && (
                    <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl">
                        <BookOpen className="h-16 w-16 text-buttonsCustom-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-buttonsCustom-900 mb-2">No courses found</h3>
                        <p className="text-buttonsCustom-700">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Courses Grid */}
                {!isLoading && filteredCourses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course.course_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-buttonsCustom-200/30">
                                    <div
                                        className="relative aspect-video cursor-pointer overflow-hidden group"
                                        onClick={() => handleCourseClick(course.slug)}
                                    >
                                        <Image
                                            src={course.image || "/placeholder-course.jpg"}
                                            alt={course.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-buttonsCustom-600 text-white backdrop-blur-sm capitalize">
                                                {course.level}
                                            </Badge>
                                        </div>
                                        {course.featured && (
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-yellow-500 text-white backdrop-blur-sm">
                                                    Featured
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="outline" className="text-xs border-buttonsCustom-300 text-buttonsCustom-700">
                                                {course.category.title}
                                            </Badge>
                                            <span className="text-xl font-bold text-buttonsCustom-600">
                                                ₹{course.price}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2 hover:text-buttonsCustom-600 transition-colors cursor-pointer text-buttonsCustom-900" onClick={() => handleCourseClick(course.slug)}>
                                            {course.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 pb-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Avatar className="h-8 w-8 border-2 border-buttonsCustom-200">
                                                <AvatarImage src={course.teacher.image} alt={course.teacher.full_name} />
                                                <AvatarFallback className="bg-buttonsCustom-100 text-buttonsCustom-700">{course.teacher.full_name[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm text-buttonsCustom-700 font-medium">{course.teacher.full_name}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-buttonsCustom-600">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{course.students.length} students</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{course.language}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-3 border-t border-buttonsCustom-100 flex-col gap-3">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-1">
                                                <Rater total={5} rating={course.average_rating || 0} interactive={false} />
                                                <span className="text-sm text-buttonsCustom-700 ml-1 font-medium">
                                                    ({course.rating_count})
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleCourseClick(course.slug)}
                                                className="flex-1 rounded-lg border-buttonsCustom-300 text-buttonsCustom-700 hover:bg-buttonsCustom-50"
                                            >
                                                Details
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={(e) => handleEnrollClick(e, course)}
                                                className="flex-1 bg-buttonsCustom-600 hover:bg-buttonsCustom-700 text-white rounded-lg font-semibold"
                                            >
                                                Enroll Now
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
