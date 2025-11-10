import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, GraduationCap, FileQuestion, Plus, Trash2, Edit, Layers, Video } from "lucide-react";
import { toast } from "sonner";
import VideoUploadForm from "@/components/VideoUploadForm";


interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  students: number;
}

interface Section {
  id: string;
  title: string;
  course_id: string;
}

interface Lesson {
  id: string;
  title: string;
  video_url: string;
  duration: string;
  section_id: string;
}

const TeacherDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [newCourse, setNewCourse] = useState({ title: "", description: "", instructor: "", category: "" });
  const [newSection, setNewSection] = useState({ title: "" });
  const [newLesson, setNewLesson] = useState({ title: "", video_url: "", duration: "" });

  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [openSectionDialog, setOpenSectionDialog] = useState(false);
  const [openLessonDialog, setOpenLessonDialog] = useState(false);

  // Courses
  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(setCourses);
  }, []);

  // Sections (when course selected)
  useEffect(() => {
    if (selectedCourse) {
      fetch(`/api/courses/${selectedCourse.id}/sections`)
        .then(res => res.json())
        .then(setSections);
      setSelectedSection(null);
    }
  }, [selectedCourse]);

  // Lessons (when section selected)
  useEffect(() => {
    if (selectedSection) {
      fetch(`/api/sections/${selectedSection.id}/lessons`)
        .then(res => res.json())
        .then(setLessons);
    }
  }, [selectedSection]);

  // Add Course
  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description || !newCourse.instructor || !newCourse.category) {
      toast.error("Please fill all fields");
      return;
    }
    fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCourse, students: 0 })
    }).then(() => {
      setNewCourse({ title: "", description: "", instructor: "", category: "" });
      setOpenCourseDialog(false);
      toast.success("Course added successfully!");
      fetch("/api/courses")
        .then((res) => res.json())
        .then(setCourses);
    });
  };

  // Add Section
  const handleAddSection = () => {
    if (!newSection.title || !selectedCourse) {
      toast.error("Select a course and fill the section title");
      return;
    }
    fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: selectedCourse.id, title: newSection.title })
    }).then(() => {
      setNewSection({ title: "" });
      setOpenSectionDialog(false);
      toast.success("Section added successfully!");
      fetch(`/api/courses/${selectedCourse.id}/sections`)
        .then((res) => res.json())
        .then(setSections);
    });
  };

  // Add Lesson
  const handleAddLesson = () => {
    if (!newLesson.title || !newLesson.video_url || !selectedSection) {
      toast.error("Select a section and fill all lesson fields");
      return;
    }
    fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section_id: selectedSection.id, ...newLesson })
    }).then(() => {
      setNewLesson({ title: "", video_url: "", duration: "" });
      setOpenLessonDialog(false);
      toast.success("Lesson added successfully!");
      fetch(`/api/sections/${selectedSection.id}/lessons`)
        .then((res) => res.json())
        .then(setLessons);
    });
  };

  // Deleting courses/sections/lessons can be added as needed

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses and modular content</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold text-foreground">{courses.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Layers className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sections</p>
                <p className="text-2xl font-bold text-foreground">{sections.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Video className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lessons</p>
                <p className="text-2xl font-bold text-foreground">{lessons.length}</p>
              </div>
            </div>
          </Card>
        </div>
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            {/* Quizzes or other tabs as needed */}
          </TabsList>
          <TabsContent value="courses" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-foreground">My Courses</h2>
              <Dialog open={openCourseDialog} onOpenChange={setOpenCourseDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Course</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      value={newCourse.title}
                      onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                      placeholder="Course Title"
                    />
                    <Input
                      value={newCourse.description}
                      onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                      placeholder="Description"
                    />
                    <Input
                      value={newCourse.instructor}
                      onChange={e => setNewCourse({ ...newCourse, instructor: e.target.value })}
                      placeholder="Instructor"
                    />
                    <Input
                      value={newCourse.category}
                      onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                      placeholder="Category"
                    />
                    <Button onClick={handleAddCourse} className="w-full">
                      Add Course
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4">
              {courses.map(course => (
                <Card key={course.id} className={`p-6 ${selectedCourse?.id === course.id ? "border-2 border-primary" : ""}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3
                        className="text-xl font-semibold text-foreground mb-2 cursor-pointer"
                        onClick={() => setSelectedCourse(course)}
                      >
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground mb-2">{course.description}</p>
                      <p className="text-sm text-muted-foreground">Instructor: {course.instructor} | Category: {course.category}</p>
                      <p className="text-sm text-muted-foreground">{course.students} students enrolled</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {/* --- Sections for selected course --- */}
            {selectedCourse && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold">Sections for {selectedCourse.title}</h2>
                  <Dialog open={openSectionDialog} onOpenChange={setOpenSectionDialog}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Section
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Section</DialogTitle>
                      </DialogHeader>
                      <Input
                        value={newSection.title}
                        onChange={e => setNewSection({ title: e.target.value })}
                        placeholder="Section Title"
                      />
                      <Button onClick={handleAddSection} className="w-full">
                        Add Section
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
                <ul>
                  {sections.map(section => (
                    <li
                      key={section.id}
                      className={`p-2 my-1 cursor-pointer rounded ${selectedSection?.id === section.id ? "bg-primary/10" : "hover:bg-secondary/10"}`}
                      onClick={() => setSelectedSection(section)}
                    >
                      {section.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* --- Lessons for selected section --- */}
            {selectedSection && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">Lessons in {selectedSection.title}</h3>
                  <Dialog open={openLessonDialog} onOpenChange={setOpenLessonDialog}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Lesson
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Lesson</DialogTitle>
                      </DialogHeader>
                      <Input
                        value={newLesson.title}
                        onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                        placeholder="Lesson Title"
                      />
                      <Input
                        value={newLesson.duration}
                        onChange={e => setNewLesson({ ...newLesson, duration: e.target.value })}
                        placeholder="Duration"
                      />
                      <Input
                        value={newLesson.video_url}
                        onChange={e => setNewLesson({ ...newLesson, video_url: e.target.value })}
                        placeholder="Video URL"
                      />
                      <VideoUploadForm onUploadSuccess={url => setNewLesson(prev => ({ ...prev, video_url: url }))} />
                      <Button onClick={handleAddLesson} className="w-full">
                        Add Lesson
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
                <ul>
                  {lessons.map(lesson => (
                    <li key={lesson.id} className="my-2 p-2 border rounded bg-card">
                      <strong>{lesson.title}</strong> ({lesson.duration})
                      <div>
                        <video src={lesson.video_url} controls width="300" className="mt-2" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;
