import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Users, BookOpen, Award, Play, CheckCircle2, Circle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import VideoPlayer from "../components/ui/VideoPlayer";

// SectionLessons displays a list of lessons in a section.
// When a lesson is clicked, it calls onSelectLesson with that lesson object.
function SectionLessons({ sectionId, onSelectLesson }) {
  const [lessons, setLessons] = useState([]);
  
  useEffect(() => {
    fetch(`/api/sections/${sectionId}/lessons`)
      .then((res) => res.json())
      .then(setLessons);
  }, [sectionId]);
  
  return (
    <div className="space-y-2 pt-2">
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => onSelectLesson(lesson)}
        >
          <div className="flex items-center gap-3">
            <Circle className="h-5 w-5 text-muted-foreground" />
            <span>{lesson.title}</span>
          </div>
          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
        </div>
      ))}
    </div>
  );
}

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then((res) => res.json())
      .then(setCourse);

    fetch(`/api/courses/${id}/sections`)
      .then((res) => res.json())
      .then(setModules);
  }, [id]);

  if (!course) return <div>Loading...</div>;

  const learningOutcomes =
    course.learningOutcomes ??
    [
      "Learning outcomes are not provided for this course in the database.",
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
                  {(course.students ?? 0).toLocaleString()} students
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {course.lessons} lessons
                </div>
              </div>
              <div className="space-y-3 bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-between text-sm">
                  <span>Your Progress</span>
                  <span className="font-semibold">{course.progress ?? 0}% Complete</span>
                </div>
                <Progress value={course.progress ?? 0} className="h-3" />
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player for Selected Lesson */}
            {selectedLesson && selectedLesson.video_url && (
              <Card className="mb-8 p-0 overflow-hidden">
                <VideoPlayer url={selectedLesson.video_url} />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{selectedLesson.title}</h3>
                  <div className="text-muted-foreground">{selectedLesson.duration}</div>
                </div>
              </Card>
            )}

            {/* What You'll Learn */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {learningOutcomes.map((outcome, index) => (
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
                  <AccordionItem key={module.id} value={`module-${moduleIndex}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-medium">{module.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <SectionLessons sectionId={module.id} onSelectLesson={setSelectedLesson} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{course.lessons} lessons</div>
                    <div className="text-sm text-muted-foreground">Total Lessons</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium">{course.duration}</div>
                    <div className="text-sm text-muted-foreground">Total Duration</div>
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
