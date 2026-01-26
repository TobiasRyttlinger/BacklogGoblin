# Backlog Goblin - Development Progress

## Project Vision
- Goblin-themed miniature painting backlog app
- Goblin carries each entry as a Warhammer box
- Soft paywall after 10 entries
- Gamification (XP, levels, achievements)

---

## Current Status: Step 1 of Core Functionality

### What's Done
- [x] Basic project setup (Expo + React Native)
- [x] Home screen with backlog list
- [x] BacklogEntry type defined (id, name, quantity, status)
- [x] Sample data displaying in FlatList
- [x] Dark theme base styling
- [x] State variables for modal (modalVisible, newName, newQuantity)

### Currently Working On
**Task: Fix the Add Entry Modal**

The modal state exists but isn't connected. You need to:

1. Add imports: `Modal` and `TextInput` from 'react-native'
2. Create a `<Modal>` component with:
   - Overlay background
   - Content box with inputs
   - Name input (connected to `newName`)
   - Quantity input (connected to `newQuantity`)
   - Submit button
   - Cancel button
3. Update `addEntry()` to use the input values instead of hardcoded "new squad"
4. Change the "+ Add Squad" button to open the modal

**Hint code:**
```tsx
<Modal visible={modalVisible} animationType="slide" transparent>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <TextInput
        value={newName}
        onChangeText={setNewName}
        placeholder="Squad name"
        placeholderTextColor="#666"
        style={styles.input}
      />
      {/* Add quantity input and buttons */}
    </View>
  </View>
</Modal>
```

---

## Roadmap

### Phase 1: Core Functionality
- [ ] Working add entry modal with inputs
- [ ] Status toggling (tap to cycle: unpainted -> in_progress -> painted)
- [ ] Delete entries (swipe or long press)
- [ ] Data persistence with AsyncStorage

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
