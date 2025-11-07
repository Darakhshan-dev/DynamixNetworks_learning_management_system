import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface CourseCardProps {
  id: number;
  title: string;
  instructor: string;
  category: string;
  duration: string;
  progress?: number;
  thumbnail: string;
  lessons: number;
  // students?: number; // Uncomment ONLY if used and available
}

const CourseCard = ({
  id,
  title,
  instructor,
  category,
  duration,
  progress,
  thumbnail,
  lessons,
  // students, // Uncomment if actually available in backend/data
}: CourseCardProps) => {
  return (
    <Link to={`/course/${id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-primary/40" />
          </div>
          <Badge className="absolute top-3 right-3 bg-card text-card-foreground">
            {category}
          </Badge>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{instructor}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {duration}
            </div>
            {/* Uncomment below if you add students column
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {students} students
            </div>
            */}
            <div className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {lessons} lessons
            </div>
          </div>
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default CourseCard;
