import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Users } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  description: string;
  type: "discussion" | "social" | "author-visit";
}

export const EventCard = ({
  title,
  date,
  time,
  location,
  attendees,
  maxAttendees,
  description,
  type
}: EventCardProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "discussion": return "bg-primary text-primary-foreground";
      case "social": return "bg-accent text-accent-foreground";
      case "author-visit": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const isFullyBooked = attendees >= maxAttendees;

  return (
    <Card className="hover:shadow-book transition-all duration-300 bg-card">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          </div>
          <Badge className={getTypeColor(type)}>
            {type.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{attendees}/{maxAttendees}</span>
          </div>
        </div>
        
        <Button 
          variant={isFullyBooked ? "secondary" : "default"} 
          size="sm" 
          className="w-full"
          disabled={isFullyBooked}
        >
          {isFullyBooked ? "Fully Booked" : "Join Event"}
        </Button>
      </CardContent>
    </Card>
  );
};