
import { format } from "date-fns";
import { Note } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NoteForm } from "./NoteForm";
import { useState } from "react";
import { useNotes } from "@/context/NoteContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NoteCardProps {
  note: Note;
}

export const NoteCard = ({ note }: NoteCardProps) => {
  const { deleteNote } = useNotes();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const formattedDate = note.updatedAt
    ? format(new Date(note.updatedAt), "MMM d, yyyy")
    : "";
    
  const handleDelete = () => {
    deleteNote(note.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className={`note-card overflow-hidden ${note.color} text-white border-none animate-scale-in`}>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2 line-clamp-1">{note.title}</h3>
          <p className="line-clamp-4 text-sm opacity-90">{note.content}</p>
        </CardContent>
        <CardFooter className="px-6 py-4 bg-black/10 flex justify-between text-xs">
          <div className="flex items-center">
            <span>{formattedDate}</span>
            {note.reminder && (
              <div className="ml-2 flex items-center gap-1 bg-white/20 text-white px-2 py-1 rounded-full">
                <Bell size={12} />
                <span className="text-xs">{format(new Date(note.reminder), "MMM d")}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 bg-white/20 hover:bg-white/40" 
              onClick={() => setIsEditOpen(true)}
            >
              <Edit size={14} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 bg-white/20 hover:bg-white/40" 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <NoteForm 
            existingNote={note} 
            onComplete={() => setIsEditOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the note titled "{note.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
