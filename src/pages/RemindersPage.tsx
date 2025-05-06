
import { useState, useEffect } from "react";
import { useNotes } from "@/context/NoteContext";
import { format, isAfter } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoteForm } from "@/components/NoteForm";

export const RemindersPage = () => {
  const { notes } = useNotes();
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  
  // Filter notes with reminders and sort by date
  const notesWithReminders = notes
    .filter((note) => note.reminder)
    .sort((a, b) => {
      const dateA = new Date(a.reminder!);
      const dateB = new Date(b.reminder!);
      return dateA.getTime() - dateB.getTime();
    });
    
  const upcomingReminders = notesWithReminders.filter((note) => 
    isAfter(new Date(note.reminder!), new Date())
  );
  
  const pastReminders = notesWithReminders.filter((note) => 
    !isAfter(new Date(note.reminder!), new Date())
  );
  
  return (
    <div className="py-8 px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-6">Your Reminders</h1>
      
      {notesWithReminders.length === 0 ? (
        <div className="text-center py-16 px-4 bg-secondary rounded-lg">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No reminders set</h3>
          <p className="text-muted-foreground mb-4">
            You haven't set any reminders for your notes yet
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcomingReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Reminders
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingReminders.map((note) => (
                  <Card key={note.id} className="animate-fade-in cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedNote(note.id)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                        <Badge variant="secondary" className="ml-2 flex items-center gap-1">
                          <Bell className="h-3 w-3" />
                          {format(new Date(note.reminder!), "MMM d")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {pastReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Past Reminders
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pastReminders.map((note) => (
                  <Card key={note.id} className="animate-fade-in cursor-pointer opacity-70 hover:opacity-100 hover:shadow-md transition-all"
                    onClick={() => setSelectedNote(note.id)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                        <Badge variant="outline" className="ml-2 flex items-center gap-1">
                          <Bell className="h-3 w-3" />
                          {format(new Date(note.reminder!), "MMM d")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Edit Note Dialog */}
      {selectedNote && (
        <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Reminder</DialogTitle>
            </DialogHeader>
            <NoteForm 
              existingNote={notes.find(note => note.id === selectedNote)!} 
              onComplete={() => setSelectedNote(null)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
