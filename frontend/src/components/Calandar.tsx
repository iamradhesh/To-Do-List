import  { useState } from 'react';

const WeekCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get current week (Sunday to Saturday)
  const getCurrentWeek = () => {
    const curr = new Date(selectedDate);
    const first = curr.getDate() - curr.getDay(); // First day is Sunday
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.setDate(first + i));
      week.push(day);
    }
    return week;
  };

  const weekDays = getCurrentWeek();
  const today = new Date();

  // Check if date is today
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full flex justify-between items-center gap-2 px-1">
      {weekDays.map((day, index) => {
        const isTodayDate = isToday(day);
        
        return (
          <div
            key={index}
            onClick={() => setSelectedDate(day)}
            className={`flex flex-col items-center justify-center cursor-pointer rounded-lg p-2 transition-all
              ${isTodayDate 
                ? 'bg-blue-600 text-white' 
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            style={{ width: '45px', height: '63px' }}
          >
            <span className={`text-xs font-medium mb-1 ${isTodayDate ? 'text-white' : 'text-gray-500'}`}>
              {dayNames[index]}
            </span>
            <span className={`text-lg font-semibold ${isTodayDate ? 'text-white' : 'text-gray-800'}`}>
              {day.getDate().toString().padStart(2, '0')}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default WeekCalendar;