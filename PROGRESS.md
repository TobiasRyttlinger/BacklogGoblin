# Backlog Goblin - Development Progress

## Project Vision
- Goblin-themed miniature painting backlog app
- Goblin carries each entry as a Warhammer box
- Soft paywall after 10 entries
- Gamification (XP, levels, achievements)

---

## Current Status: Phase 1 Complete!

### What's Done
- [x] Basic project setup (Expo + React Native)
- [x] Home screen with backlog list
- [x] BacklogEntry type defined (id, name, quantity, status)
- [x] Dark theme base styling
- [x] Working Add Entry Modal with name & quantity inputs
- [x] Status toggling (tap card to cycle: unpainted → in_progress → painted)
- [x] Delete entries (long-press to remove)
- [x] Data persistence with AsyncStorage

### Next Up
**Phase 2: Goblin Theme & Visuals**

- Goblin mascot character
- Cards styled as Warhammer boxes
- Thematic color palette
- Animations

---

## Roadmap

### Phase 1: Core Functionality ✅
- [x] Working add entry modal with inputs
- [x] Status toggling (tap to cycle: unpainted -> in_progress -> painted)
- [x] Delete entries (long press)
- [x] Data persistence with AsyncStorage

### Phase 2: Goblin Theme & Visuals
- [ ] Goblin mascot character
- [ ] Cards styled as Warhammer boxes
- [ ] Thematic color palette
- [ ] Animations (goblin carrying boxes)

### Phase 3: Soft Paywall
- [ ] Entry counter logic
- [ ] Paywall modal at 10+ entries
- [ ] Premium state management
- [ ] "Unlock" flow

### Phase 4: Gamification
- [ ] XP system (earn XP for completing minis)
- [ ] Level/rank progression
- [ ] Achievements/badges
- [ ] Stats tracking (total painted, streaks, etc.)

---

## File Locations
- Main screen: `app/(tabs)/index.tsx`
- Theme colors: `constants/theme.ts`
- Components: `components/`

## Notes
- User is learning React Native - prefers guidance over full implementations
- Ask Claude to check your work when you get stuck!
