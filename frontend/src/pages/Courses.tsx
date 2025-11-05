import { useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Trash2 } from "lucide-react";

const categories = ["All", "Web Development", "Programming", "Design", "Business", "Marketing"];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newCourse, setNewCourse] = useState({ title: "", instructor: "", category: "", duration: "", students: 0, thumbnail: "", lessons: 0 });
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch courses from the backend
  useEffect(() => {
    fetchCourses();
  }, []);

  function fetchCourses() {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => setCourses(data));
  }

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add a new course (POST to backend)
  function handleAddCourse(e) {
    e.preventDefault();
    fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse)
    })
      .then(() => {
        setShowAddForm(false);
        setNewCourse({ title: "", instructor: "", category: "", duration: "", students: 0, thumbnail: "", lessons: 0 });
        fetchCourses();
      });
  }

  // Delete a course by ID (DELETE to backend)
  function handleDeleteCourse(id) {
    fetch(`/api/courses/${id}`, { method: "DELETE" })
      .then(() => {
        fetchCourses();
      });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover your next learning adventure from our extensive course library
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search courses by title or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card"
            />
          </div>

          {/* Add Course Button */}
          <div className="mt-6 flex gap-2">
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>

          {/* Add Course Form (basic) */}
          {showAddForm && (
            <form className="mt-6 bg-card p-4 rounded-lg shadow" onSubmit={handleAddCourse}>
              <div className="flex flex-wrap gap-4">
                <Input
                  required
                  placeholder="Title"
                  value={newCourse.title}
                  onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                />
                <Input
                  required
                  placeholder="Instructor"
                  value={newCourse.instructor}
                  onChange={e => setNewCourse({ ...newCourse, instructor: e.target.value })}
                />
                <Input
                  required
                  placeholder="Category"
                  value={newCourse.category}
                  onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                />
                <Input
                  placeholder="Duration"
                  value={newCourse.duration}
                  onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Students"
                  value={newCourse.students}
                  onChange={e => setNewCourse({ ...newCourse, students: Number(e.target.value) })}
                />
                <Input
                  placeholder="Thumbnail"
                  value={newCourse.thumbnail}
                  onChange={e => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Lessons"
                  value={newCourse.lessons}
                  onChange={e => setNewCourse({ ...newCourse, lessons: Number(e.target.value) })}
                />
                <Button type="submit" className="ml-2">
                  Save Course
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="relative">
              <CourseCard {...course} />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleDeleteCourse(course.id)}
                title="Delete course"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No courses found. Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
