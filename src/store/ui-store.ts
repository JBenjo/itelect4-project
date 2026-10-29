// UI state that is NOT tied to any one page: the dark-mode switch and
// the search box in the nav bar. Zustand keeps this store outside the
// component tree, so any component can read or change it with one
// selector -- no prop drilling through Layout.
import { create } from "zustand";
import { persist } from "zustand/middleware";

// The shape of the store: two values, and the two functions that
// change them.
interface UiState {
  isDarkMode: boolean;
  searchTerm: string;
  toggleDarkMode: () => void;
  setSearchTerm: (term: string) => void;
}

const useUiStore = create<UiState>()(
  // persist wraps the store so its contents survive a page reload and
  // are written to localStorage under the key "itelect4-ui".
  persist(
    (set) => ({
      // Defaults: light mode, empty search.
      isDarkMode: false,
      searchTerm: "",

      // set() replaces only the keys given; spreading the previous
      // state keeps the rest. Flipping the flag is all this does --
      // Layout reads it and adds the "dark" class to a wrapper div.
      toggleDarkMode: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),

      setSearchTerm: (term) =>
        set({
          searchTerm: term,
        }),
    }),
    {
      name: "itelect4-ui",
      // partialize: only isDarkMode is saved. The search term is
      // forgotten on reload -- persisting it would surprise someone
      // who opens the site later and finds an old filter applied.
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
      }),
    },
  ),
);

export default useUiStore;
