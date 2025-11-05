import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Users, BookOpen, Award, Play, CheckCircle2, Circle } from "lucide-react";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();

  const course = {
    title: "Complete Web Development Bootcamp",
    instructor: "Sarah Johnson",
    category: "Web Development",
    duration: "12 hours",
    students: 15234,
    lessons: 48,
    progress: 65,
    description:
      "Master web development from scratch with this comprehensive bootcamp. Learn HTML, CSS, JavaScript, React, and more. Build real-world projects and launch your career as a web developer.",
    learningOutcomes: [
      "Build responsive websites from scratch",
      "Master modern JavaScript and ES6+",
      "Create dynamic web applications with React",
      "Deploy projects to production",
    ],
  };

  const modules = [
    {
      title: "Getting Started with Web Development",
      lessons: [
        { title: "Introduction to Web Development", duration: "10:30", completed: true },
        { title: "Setting Up Your Development Environment", duration: "15:20", completed: true },
        { title: "HTML Basics", duration: "25:45", completed: true },
      ],
    },
    {
      title: "CSS Fundamentals",
      lessons: [
        { title: "CSS Selectors and Properties", duration: "20:15", completed: true },
        { title: "Flexbox Layout", duration: "18:30", completed: true },
        { title: "CSS Grid", duration: "22:10", completed: false },
        { title: "Responsive Design", duration: "25:40", completed: false },
      ],
    },
    {
      title: "JavaScript Essentials",
      lessons: [
        { title: "JavaScript Basics", duration: "30:20", completed: false },
        { title: "DOM Manipulation", duration: "25:15", completed: false },
        { title: "Events and Event Handling", duration: "20:30", completed: false },
        { title: "Async JavaScript", duration: "28:45", completed: false },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-accent text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                {course.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-white/90 mb-6">{course.description}</p>
              
              <div className="flex items-center gap-6 text-white/90 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {course.students.toLocaleString()} students
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {course.lessons} lessons
                </div>
              </div>

              <div className="space-y-3 bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-between text-sm">
                  <span>Your Progress</span>
                  <span className="font-semibold">{course.progress}% Complete</span>
                </div>
                <Progress value={course.progress} className="h-3" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
                  <Play className="h-16 w-16 text-primary" />
                </div>
                <Button size="lg" className="w-full mb-4 bg-primary hover:bg-primary/90">
                  Continue Learning
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Instructor: <span className="font-medium text-foreground">{course.instructor}</span>
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{outcome}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Course Content */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              <Accordion type="single" collapsible className="w-full">
                {modules.map((module, moduleIndex) => (
                  <AccordionItem key={moduleIndex} value={`module-${moduleIndex}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-medium">{module.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {module.lessons.length} lessons
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-success" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                              <span className={lesson.completed ? "text-muted-foreground" : ""}>
                                {lesson.title}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">31 lessons</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium">8.5 hours</div>
                    <div className="text-sm text-muted-foreground">Time spent</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
