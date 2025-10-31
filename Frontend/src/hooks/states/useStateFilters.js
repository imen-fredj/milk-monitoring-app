import { useState, useMemo } from 'react';

export const useStateFilters = (states) => {
  const [selectedContainer, setSelectedContainer] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");

  const availableContainers = useMemo(() => {
    const containers = [...new Set(states.map(s => s.containerName))];
    return containers.sort();
  }, [states]);

  // ✅ Labels en français
  const dateFilters = [
    { key: "all", label: "Toutes les périodes" },
    { key: "today", label: "Aujourd'hui" },
    { key: "week", label: "Cette semaine" },
    { key: "month", label: "Ce mois-ci" },
    { key: "90days", label: "90 derniers jours" },
  ];

  const filteredStates = useMemo(() => {
    let filtered = [...states];

    if (selectedContainer !== "all") {
      filtered = filtered.filter(s => s.containerName === selectedContainer);
    }

    if (selectedDateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(s => {
        const stateDate = new Date(s.createdAt);
        
        switch (selectedDateFilter) {
          case "today":
            return stateDate >= today;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return stateDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return stateDate >= monthAgo;
          case "90days":
            const ninetyDaysAgo = new Date(today);
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            return stateDate >= ninetyDaysAgo;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [states, selectedContainer, selectedDateFilter]);

  const clearFilters = () => {
    setSelectedContainer("all");
    setSelectedDateFilter("all");
  };

  return {
    selectedContainer,
    setSelectedContainer,
    selectedDateFilter,
    setSelectedDateFilter,
    availableContainers,
    dateFilters,
    filteredStates,
    clearFilters,
    hasActiveFilters: selectedContainer !== "all" || selectedDateFilter !== "all"
  };
};
