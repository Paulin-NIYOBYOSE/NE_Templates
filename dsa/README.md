# DSA Practical Exam Template

Generic C++ console application for DSA exams. Adapt to any scenario in ~5 minutes.

## Quick Start

```bash
make && ./dsa_app
```

## Adaptation (config.h only)

| Setting                              | Description               | Examples                     |
| ------------------------------------ | ------------------------- | ---------------------------- |
| `USE_COMMAND_MODE` / `USE_MENU_MODE` | Interaction style         | Uncomment one                |
| `ENTITY_SINGULAR/PLURAL`             | Entity names              | Item, City, Student          |
| `RELATION_NAME`                      | Connection type           | Road, Dependency, Friendship |
| `FIELD_ID/NAME/QUANTITY/DATE`        | Column labels             | ID, Population, Score        |
| `HAS_QUANTITY/HAS_DATE`              | Enable fields             | true/false                   |
| `ENABLE_GRAPH`                       | Enable adjacency matrix   | true/false                   |
| `GRAPH_UNDIRECTED`                   | Bidirectional connections | true/false                   |
| `FILE_ITEMS/CONNECTIONS/WEIGHTS`     | Data files                | items.csv, roads.txt         |

## Scenario Examples

### Inventory Management

```cpp
#define ENTITY_SINGULAR  "Item"
#define ENTITY_PLURAL    "Items"
#define RELATION_NAME    "Dependency"
#define FIELD_QUANTITY   "Quantity"
#define FIELD_DATE       "AddedDate"
```

### Road Network

```cpp
#define ENTITY_SINGULAR  "City"
#define ENTITY_PLURAL    "Cities"
#define RELATION_NAME    "Road"
#define FIELD_QUANTITY   "Population"
#define FIELD_DATE       "Founded"
#define FILE_ITEMS       "cities.csv"
#define FILE_CONNECTIONS "roads.txt"
```

### Student Records

```cpp
#define ENTITY_SINGULAR  "Student"
#define ENTITY_PLURAL    "Students"
#define RELATION_NAME    "Friendship"
#define FIELD_QUANTITY   "Score"
#define FIELD_DATE       "Enrolled"
#define HAS_DATE         false  // Disable if not needed
```

## Commands (Command Mode)

| Command      | Action                             |
| ------------ | ---------------------------------- |
| `add`        | Add entity interactively           |
| `list`       | List all entities                  |
| `search`     | Search by ID or name               |
| `edit`       | Edit entity                        |
| `delete`     | Delete entity                      |
| `sort <0-3>` | Sort (0=ID, 1=Name, 2=Qty, 3=Date) |
| `connect`    | Add connection                     |
| `weight`     | Set connection weight              |
| `adj`        | Show adjacency matrix              |
| `weights`    | Show weight matrix                 |
| `links <id>` | Show connections for entity        |
| `save`       | Save all data                      |
| `load`       | Load all data                      |
| `help`       | Show commands                      |
| `exit`       | Exit                               |

## Menu Mode

Numbered options 1-9. Set `USE_MENU_MODE` in config.h.

## File Formats

**items.csv**

```
ID,Name,Quantity,Date
1,Alpha,100,2024-01-15
2,Beta,200,2024-02-20
```

**connections.txt** (adjacency matrix)

```
2
1,2
0,1
1,0
```

## Build Commands

```bash
make          # Build
make run      # Build & run
make test     # Run with test_input.txt
make clean    # Remove binary
make cleanall # Remove binary + data files
```

## Features

- **CRUD**: Add, list, search, edit, delete
- **Graph**: Adjacency matrix, weight matrix, connections
- **Files**: CSV persistence, auto-load on start
- **Validation**: ID range, name length, date format
- **Sorting**: By any field, auto-sort option
- **Seed data**: Set `SEED_ON_START true` for testing

## Requirements

- C++17 compiler (g++, clang++)
- Standard library only
