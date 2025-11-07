import React, { useEffect, useState } from 'react';
import VideoPlayer from '../components/ui/VideoPlayer';

// LessonsPage or LessonPlayer (keep the function name matching your file name)
function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    fetch('/api/lessons') // Update with your API endpoint
      .then(res => res.json())
      .then(setLessons);
  }, []);

  return (
    <div>
      <div>
        {lessons.map(lesson => (
          <div
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson)}
            style={{ cursor: 'pointer', padding: 8, borderBottom: '1px solid #eee' }}
          >
            {lesson.title}
          </div>
        ))}
      </div>
      {selectedLesson && selectedLesson.video_url && (
        <VideoPlayer url={selectedLesson.video_url} />
      )}
    </div>
  );
}

export default LessonsPage;
