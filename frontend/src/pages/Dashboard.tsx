import { useState, useEffect } from "react";
import StatsCard from "@/components/StatsCard";
import CourseCard from "@/components/CourseCard";
import { BookOpen, TrendingUp, Award, Clock } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { title: "Courses Enrolled", value: 8, icon: BookOpen, color: "primary" as const },
    { title: "In Progress", value: 3, icon: TrendingUp, color: "accent" as const, trend: "+2 this month" },
    { title: "Completed", value: 5, icon: Award, color: "success" as const },
    { title: "Learning Hours", value: "124", icon: Clock, color: "secondary" as const },
  ];

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentLessons, setRecentLessons] = useState([]);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then(setEnrolledCourses)
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  useEffect(() => {
    fetch("/api/lessons") // Make sure backend returns lessons with video_url
      .then((res) => res.json())
      .then(setRecentLessons)
      .catch((error) => {
        console.error("Error fetching lessons:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Student! 👋</h1>
          <p className="text-muted-foreground">Continue your learning journey and reach your goals</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Continue Learning Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Continue Learning</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                instructor={course.instructor}
                category={course.category}
                duration={course.duration}
                progress={course.progress ?? 0}
                thumbnail={course.thumbnail || ""}
                lessons={course.lessons ?? 0}
              />
            ))}
          </div>
        </section>

        {/* Recent Lessons Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Recent Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {recentLessons.map((lesson) => {
  console.log("Student lesson video_url:", lesson.video_url); // Add this

  return (
    <div key={lesson.id} className="p-4 border rounded bg-card">
      <h3 className="mb-2 font-semibold">{lesson.title}</h3>
      <video
        src={lesson.video_url}
        controls
        width="100%"
        style={{ maxWidth: "500px" }}
      />
    </div>
  );
})}

          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: "Completed", item: "React Hooks Module", time: "2 hours ago" },
              { action: "Started", item: "TypeScript Fundamentals", time: "1 day ago" },
              { action: "Earned", item: "Frontend Developer Badge", time: "3 days ago" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {activity.action} <span className="text-primary">{activity.item}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
