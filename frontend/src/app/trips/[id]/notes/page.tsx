"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  BookOpen,
  MapPin,
  Calendar,
  Smile,
  Zap,
  Meh,
  Battery,
  Search,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { mockNotes, Note } from "@/lib/mockData";
import { useTrips } from "@/lib/tripsContext";

const moodConfig = {
  happy: { icon: Smile, color: "text-yellow-500 bg-yellow-50", label: "Happy" },
  excited: { icon: Zap, color: "text-orange-500 bg-orange-50", label: "Excited" },
  neutral: { icon: Meh, color: "text-gray-500 bg-gray-50", label: "Neutral" },
  tired: { icon: Battery, color: "text-blue-500 bg-blue-50", label: "Tired" },
};

export default function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { trips } = useTrips();
  const trip = trips.find((t) => t.id === id) || trips[0];

  const [notes, setNotes] = useState<Note[]>(mockNotes.filter((n) => n.tripId === trip.id));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    day: "",
    city: "",
    mood: "happy" as Note["mood"],
  });
  const [editNote, setEditNote] = useState<Partial<Note>>({});

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  const addNote = () => {
    if (!newNote.title.trim()) return;
    const note: Note = {
      id: `n-${Date.now()}`,
      tripId: trip.id,
      title: newNote.title,
      content: newNote.content,
      day: newNote.day,
      city: newNote.city,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mood: newNote.mood,
    };
    setNotes((prev) => [note, ...prev]);
    setNewNote({ title: "", content: "", day: "", city: "", mood: "happy" });
    setAddOpen(false);
  };

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditNote({ title: note.title, content: note.content, mood: note.mood });
  };

  const saveEdit = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? { ...n, ...editNote, updatedAt: new Date().toISOString() }
          : n
      )
    );
    setEditingId(null);
    setEditNote({});
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " · " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/trips/${id}`} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trip Notes</h1>
              <p className="text-gray-500 text-sm">{trip.name}</p>
            </div>
          </div>
          <button
            onClick={() => setAddOpen(!addOpen)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>

        {/* Add Note Form */}
        <AnimatePresence>
          {addOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-card border border-orange-100 p-6 mb-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">New Note</h3>
              <div className="space-y-3">
                <input
                  value={newNote.title}
                  onChange={(e) => setNewNote((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Note title..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:border-orange-400 focus:bg-white"
                />
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Write your thoughts, memories, tips..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-orange-400 focus:bg-white resize-none"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    value={newNote.day}
                    onChange={(e) => setNewNote((p) => ({ ...p, day: e.target.value }))}
                    placeholder="Day (e.g. Day 1)"
                    className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <input
                    value={newNote.city}
                    onChange={(e) => setNewNote((p) => ({ ...p, city: e.target.value }))}
                    placeholder="City"
                    className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <select
                    value={newNote.mood}
                    onChange={(e) => setNewNote((p) => ({ ...p, mood: e.target.value as Note["mood"] }))}
                    className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-orange-400"
                  >
                    {Object.entries(moodConfig).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={addNote} className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">
                    Save Note
                  </button>
                  <button onClick={() => setAddOpen(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((note) => {
              const mood = note.mood ? moodConfig[note.mood] : null;
              const MoodIcon = mood?.icon;
              const isEditing = editingId === note.id;

              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Note Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            value={editNote.title || ""}
                            onChange={(e) => setEditNote((p) => ({ ...p, title: e.target.value }))}
                            className="w-full px-3 py-1.5 rounded-lg border border-orange-300 text-sm font-bold focus:outline-none"
                          />
                        ) : (
                          <h3 className="font-bold text-gray-900">{note.title}</h3>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {note.day && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" /> {note.day}
                            </span>
                          )}
                          {note.city && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" /> {note.city}
                            </span>
                          )}
                          {mood && MoodIcon && (
                            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${mood.color}`}>
                              <MoodIcon className="w-3 h-3" /> {mood.label}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {isEditing ? (
                          <>
                            <button onClick={() => saveEdit(note.id)} className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 transition-colors">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(note)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteNote(note.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Note Content */}
                    {isEditing ? (
                      <textarea
                        value={editNote.content || ""}
                        onChange={(e) => setEditNote((p) => ({ ...p, content: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg border border-orange-300 text-sm text-gray-600 focus:outline-none resize-none"
                      />
                    ) : (
                      <p className="text-sm text-gray-600 leading-relaxed">{note.content}</p>
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-gray-400 mt-3">
                      {formatDate(note.updatedAt)}
                      {note.updatedAt !== note.createdAt && " (edited)"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <h3 className="text-gray-700 font-semibold mb-1">No notes yet</h3>
            <p className="text-gray-400 text-sm mb-4">Start capturing your travel memories</p>
            <button
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> Write First Note
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}