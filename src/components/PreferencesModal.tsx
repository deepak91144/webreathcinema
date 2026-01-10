"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Check, Star, Film as FilmIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

interface PreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreferencesModal({ open, onOpenChange }: PreferencesModalProps) {
  const { user, updatePreferences } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [favoriteActors, setFavoriteActors] = useState<string[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<string[]>([]);
  const [favoriteActresses, setFavoriteActresses] = useState<string[]>([]);
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);

  const [inputValue, setInputValue] = useState("");

  const genres = ["Action", "Drama", "Comedy", "Thriller", "Horror", "Sci-Fi", "Romance", "Documentary", "Animation", "Mystery"];
  
  const steps = [
    {
      title: "Favorite Actors",
      subtitle: "Who are your favorite actors?",
      items: favoriteActors,
      setItems: setFavoriteActors,
      isSelection: false,
    },
    {
      title: "Favorite Movies",
      subtitle: "What are your all-time favorite films?",
      items: favoriteMovies,
      setItems: setFavoriteMovies,
      isSelection: false,
    },
    {
      title: "Favorite Actresses",
      subtitle: "Who are your favorite actresses?",
      items: favoriteActresses,
      setItems: setFavoriteActresses,
      isSelection: false,
    },
    {
      title: "Favorite Genres",
      subtitle: "Which genres do you love?",
      items: favoriteGenres,
      setItems: setFavoriteGenres,
      isSelection: true,
      options: genres,
    },
  ];

  const currentStep = steps[step];

  const handleAdd = () => {
    if (inputValue.trim() && !currentStep.items.includes(inputValue.trim())) {
      currentStep.setItems([...currentStep.items, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemove = (item: string) => {
    currentStep.setItems(currentStep.items.filter((i) => i !== item));
  };

  const handleToggleGenre = (genre: string) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter((g) => g !== genre));
    } else {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updatePreferences({
        favoriteActors,
        favoriteMovies,
        favoriteActresses,
        favoriteGenres,
      });
      onOpenChange(false);
      setStep(0);
      
      // Redirect to user's profile page
      if (user) {
        router.push(`/profile/${user.username}`);
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-black/95 border border-primary/20 text-foreground backdrop-blur-xl overflow-hidden">
        {/* Cinematic background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 p-6">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 mx-1 rounded-full transition-all duration-500 ${
                    index <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Step {step + 1} of {steps.length}
            </p>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4">
              {step === 3 ? <FilmIcon className="h-8 w-8 text-primary" /> : <Star className="h-8 w-8 text-primary" />}
            </div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent">
              {currentStep.title}
            </h2>
            <p className="text-muted-foreground mt-2">{currentStep.subtitle}</p>
          </div>

          <div className="space-y-6">
            {currentStep.isSelection ? (
              <div className="grid grid-cols-2 gap-3">
                {currentStep.options?.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleToggleGenre(genre)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                      favoriteGenres.includes(genre)
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border/50 bg-background/50 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{genre}</span>
                      {favoriteGenres.includes(genre) && <Check className="h-5 w-5" />}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                    placeholder={`Add ${currentStep.title.toLowerCase().slice(0, -1)}...`}
                    className="flex-1 px-4 py-3 rounded-lg bg-background/50 border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none backdrop-blur-sm"
                  />
                  <button
                    onClick={handleAdd}
                    className="px-6 py-3 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[100px]">
                  {currentStep.items.map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary"
                    >
                      <span>{item}</span>
                      <button
                        onClick={() => handleRemove(item)}
                        className="hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {currentStep.items.length === 0 && (
                    <p className="text-muted-foreground text-sm">No items added yet. Start typing to add!</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border/30">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {step === steps.length - 1 ? (loading ? "Saving..." : "Finish") : "Next"}
              {step !== steps.length - 1 && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
