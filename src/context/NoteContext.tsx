
import { createContext, useContext, useState, ReactNode } from "react";
import { Note } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

interface NoteContextType {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "userId">) => void;
  updateNote: (note: Partial<Note> & { id: string }) => void;
  deleteNote: (id: string) => void;
  loading: boolean;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

const noteColors = [
  "bg-gradient-primary",
  "bg-gradient-secondary", 
  "bg-gradient-success",
  "bg-gradient-warning",
  "bg-gradient-danger",
];

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    // Load notes from localStorage
    const storedNotes = localStorage.getItem("notes");
    return storedNotes ? JSON.parse(storedNotes) : [];
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const addNote = (noteData: Omit<Note, "id" | "createdAt" | "updatedAt" | "userId">) => {
    try {
      setLoading(true);
      const now = new Date().toISOString();
      const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
      
      const newNote: Note = {
        ...noteData,
        id: Math.random().toString(36).substring(2, 15),
        color: noteData.color || randomColor,
        createdAt: now,
        updatedAt: now,
        userId: user?.id || "",
      };
      
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      
      toast({
        title: "Note created",
        description: "Your note has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to create note",
        description: "There was an error creating your note.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateNote = (noteData: Partial<Note> & { id: string }) => {
    try {
      setLoading(true);
      
      const noteIndex = notes.findIndex(note => note.id === noteData.id);
      
      if (noteIndex === -1) {
        throw new Error("Note not found");
      }
      
      const updatedNote = {
        ...notes[noteIndex],
        ...noteData,
        updatedAt: new Date().toISOString()
      };
      
      const updatedNotes = [...notes];
      updatedNotes[noteIndex] = updatedNote;
      
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to update note",
        description: "There was an error updating your note.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = (id: string) => {
    try {
      setLoading(true);
      
      const updatedNotes = notes.filter(note => note.id !== id);
      
      if (updatedNotes.length === notes.length) {
        throw new Error("Note not found");
      }
      
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to delete note",
        description: "There was an error deleting your note.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote, loading }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NoteProvider");
  }
  return context;
};
