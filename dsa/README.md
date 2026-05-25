# DSA Practical Exam Template

A **generic, reusable console application template** for Data Structures and Algorithms practical exams. This template is adaptable to any scenario (inventory management, road network, city management, student records, etc.) by changing only a few configuration constants.

## Features

### Core Functionality
- **Entity Management**: Add, list, search, edit, delete entities
- **Graph Support**: Adjacency matrix and weight matrix for relations
- **File Persistence**: CSV for entities, text files for matrices
- **Sorting**: By ID, name, quantity, or date
- **Validation**: Input ranges, date format, duplicate checking

### Interaction Styles
1. **Command-line style**: `itemadd <args>`, `itemslist`, `help`, `exit`
2. **Menu style**: Numbered options (1-9) with sub-menus

## Quick Start

### Build
```bash
make
```

### Run
```bash
./dsa_app
```

### Build & Run
```bash
make run
```

## Adapting to Your Exam Scenario

### Step 1: Edit `config.h`

Change these values to match your exam scenario:

```cpp
// Entity names
#define ENTITY_NAME_SINGULAR "City"      // Was: "Item"
#define ENTITY_NAME_PLURAL   "Cities"    // Was: "Items"
#define RELATION_NAME        "Road"      // Was: "Connection"

// Command prefix (for command-line style)
#define COMMAND_PREFIX       "city"      // Commands: cityadd, cityslist, etc.

// Field names
#define FIELD_ID             "CityID"
#define FIELD_NAME           "CityName"
#define FIELD_QUANTITY       "Population"  // Or: "Budget", "Score"
#define FIELD_DATE           "Founded"

// File names
#define ENTITIES_FILE        "cities.csv"
#define RELATIONS_FILE       "roads.txt"
#define WEIGHTS_FILE         "distances.txt"
```

### Step 2: Choose Interaction Style

In `config.h`, uncomment ONE of these:

```cpp
#define USE_COMMAND_STYLE  // Command-line: itemadd, itemslist, help, exit
// #define USE_MENU_STYLE  // Menu: numbered options 1-9
```

### Step 3: Modify Item Struct (if needed)

In `main.cpp`, update the `Item` struct:

```cpp
struct Item {
    int id;
    string name;
    int quantity;      // Rename to: budget, population, score
    string date;       // Rename to: founded, registered, created
    
    // Add new fields if needed:
    // string category;
    // double price;
    // int priority;
};
```

## Common Exam Scenarios

### Inventory Management
```cpp
#define ENTITY_NAME_SINGULAR "Item"
#define ENTITY_NAME_PLURAL   "Items"
#define RELATION_NAME        "Dependency"
#define FIELD_QUANTITY       "Quantity"
#define FIELD_DATE           "AddedDate"
```

### Road Network / City Management
```cpp
#define ENTITY_NAME_SINGULAR "City"
#define ENTITY_NAME_PLURAL   "Cities"
#define RELATION_NAME        "Road"
#define FIELD_QUANTITY       "Population"
#define FIELD_DATE           "Founded"
```

### Student Records
```cpp
#define ENTITY_NAME_SINGULAR "Student"
#define ENTITY_NAME_PLURAL   "Students"
#define RELATION_NAME        "Friendship"
#define FIELD_QUANTITY       "Score"
#define FIELD_DATE           "EnrollmentDate"
```

### Task Management
```cpp
#define ENTITY_NAME_SINGULAR "Task"
#define ENTITY_NAME_PLURAL   "Tasks"
#define RELATION_NAME        "Dependency"
#define FIELD_QUANTITY       "Priority"
#define FIELD_DATE           "DueDate"
```

## Command Reference (Command-line Style)

| Command | Description |
|---------|-------------|
| `itemadd <id> <name> <qty> <date>` | Add new entity |
| `itemaddinteractive` | Add entity interactively |
| `itemslist` | List all entities |
| `itemsearch <id\|name>` | Search by ID or name |
| `itemedit <id>` | Edit entity |
| `itemdelete <id>` | Delete entity |
| `itemsort <0-3>` | Sort (0=ID, 1=Name, 2=Qty, 3=Date) |
| `connect <from_id> <to_id>` | Add connection |
| `weight <from> <to> <w>` | Set connection weight |
| `adjmatrix` | Display adjacency matrix |
| `weightmatrix` | Display weight matrix |
| `connections <id>` | List connections for entity |
| `save` | Save all data to files |
| `load` | Load all data from files |
| `help` | Show help |
| `exit` | Exit program |

## File Formats

### Entities CSV (`items.csv`)
```csv
ID,Name,Quantity,Date
1,Widget,100,2024-01-15
2,Gadget,50,2024-02-20
```

### Adjacency Matrix (`connections.txt`)
```
3
1,2,3
0,1,0
1,0,1
0,1,0
```

### Weight Matrix (`weights.txt`)
```
3
1,2,3
-1,10,-1
10,-1,5
-1,5,-1
```

## Functions Reference

### Entity Operations
- `addItem(id, name, quantity, date)` - Add entity
- `listItems(sorted, sortField)` - List all entities
- `searchById(id)` - Search by ID
- `searchByName(name)` - Search by name (partial match)
- `editItem(id)` - Edit entity
- `deleteItem(id)` - Delete entity
- `sortItems(field)` - Sort entities

### Graph Operations
- `addConnection(fromId, toId, bidirectional)` - Add connection
- `setWeight(fromId, toId, weight, bidirectional)` - Set weight
- `removeConnection(fromId, toId, bidirectional)` - Remove connection
- `displayAdjacencyMatrix()` - Show adjacency matrix
- `displayWeightMatrix()` - Show weight matrix
- `listConnections(id)` - List connections for entity

### File Operations
- `saveEntitiesToFile(filename)` - Save entities to CSV
- `loadEntitiesFromFile(filename)` - Load entities from CSV
- `saveRelationsToFile(filename)` - Save adjacency matrix
- `loadRelationsFromFile(filename)` - Load adjacency matrix
- `saveWeightsToFile(filename)` - Save weight matrix
- `loadWeightsFromFile(filename)` - Load weight matrix
- `saveAllData()` - Save everything
- `loadAllData()` - Load everything

### Validation Functions
- `isValidId(id, checkDuplicate)` - Validate ID
- `isValidName(name)` - Validate name
- `isValidQuantity(qty)` - Validate quantity
- `isValidDate(date)` - Validate date (YYYY-MM-DD)

### Utility Functions
- `toLower(str)` - Convert to lowercase
- `trim(str)` - Trim whitespace
- `equalsIgnoreCase(a, b)` - Case-insensitive compare
- `isNumeric(str)` - Check if numeric
- `findItemIndexById(id)` - Find index by ID
- `findItemIndexByName(name)` - Find index by name

## Compilation

### Using Make
```bash
make          # Build
make run      # Build and run
make debug    # Build with debug symbols
make clean    # Remove compiled files
```

### Manual Compilation
```bash
g++ -std=c++17 -o dsa_app main.cpp
```

## Requirements

- C++17 compatible compiler (g++, clang++)
- Standard library only (no external dependencies)

## License

Free to use for educational purposes.
