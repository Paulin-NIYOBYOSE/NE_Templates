/**
 * ===========================================================================
 * DSA EXAM TEMPLATE - CONFIGURATION
 * ===========================================================================
 * 
 * HOW TO ADAPT:
 *   1. MODE: Uncomment USE_COMMAND_MODE or USE_MENU_MODE
 *   2. NAMES: Change ENTITY_SINGULAR/PLURAL (e.g., "City"/"Cities")
 *   3. FIELDS: Change FIELD_* labels (e.g., FIELD_QUANTITY -> "Population")
 *   4. FEATURES: Toggle HAS_QUANTITY, HAS_DATE, ENABLE_GRAPH
 *   5. FILES: Change FILE_* names (e.g., "cities.csv", "roads.txt")
 * 
 * EXAMPLE SCENARIOS:
 *   Inventory:  Item/Items,       Quantity,   Date,      Dependency
 *   Roads:      City/Cities,      Population, Founded,   Road
 *   Students:   Student/Students, Score,      Enrolled,  Friendship
 *   Library:    Book/Books,       Copies,     Published, Reference
 * ===========================================================================
 */

#ifndef CONFIG_H
#define CONFIG_H

// ===========================================================================
// MODE SELECTION - Uncomment ONE
// ===========================================================================
#define USE_COMMAND_MODE    // Commands: add, list, search, help, exit
// #define USE_MENU_MODE    // Menu: numbered options 1-9

// ===========================================================================
// FEATURE TOGGLES - Set to true/false to enable/disable features
// ===========================================================================
#define HAS_QUANTITY        true   // false = hide quantity field (e.g., no scores needed)
#define HAS_DATE            true   // false = hide date field (e.g., no dates needed)
#define ENABLE_GRAPH        true   // false = disable adjacency matrix (simple list only)
#define GRAPH_UNDIRECTED    true   // false = directed graph (A->B != B->A)
#define ALLOW_DUPLICATE_NAMES false // true = allow same name for different IDs
#define AUTO_SORT           true   // false = manual sorting only
#define SEED_ON_START       false  // true = add sample data on first run (for testing)

// ===========================================================================
// ENTITY & RELATION NAMES - Change these for your scenario
// ===========================================================================
#define ENTITY_SINGULAR     "Item"         // Single entity: "City", "Student", "Book"
#define ENTITY_PLURAL       "Items"        // Plural: "Cities", "Students", "Books"
#define RELATION_NAME       "Connection"   // Relation: "Road", "Friendship", "Reference"
#define CMD_PREFIX          ""             // Optional command prefix: "" or "item"

// ===========================================================================
// FIELD LABELS - Column headers and prompts
// ===========================================================================
#define FIELD_ID            "ID"           // Primary key label
#define FIELD_NAME          "Name"         // Main text field: "CityName", "Title"
#define FIELD_QUANTITY      "Quantity"     // Numeric field: "Population", "Score", "Copies"
#define FIELD_DATE          "Date"         // Date field: "Founded", "Enrolled", "Published"

// ===========================================================================
// VALIDATION LIMITS - Adjust ranges as needed
// ===========================================================================
#define MAX_ENTITIES        100            // Max items in list (array size)
#define MIN_ID              1              // Minimum valid ID
#define MAX_ID              9999           // Maximum valid ID
#define MAX_NAME_LEN        50             // Max characters in name
#define MIN_QUANTITY        0              // Min value for quantity field
#define MAX_QUANTITY        1000000        // Max value for quantity field
#define DATE_FMT            "YYYY-MM-DD"   // Expected date format for display

// ===========================================================================
// FILE NAMES - Data persistence files
// ===========================================================================
#define FILE_ITEMS          "items.csv"        // CSV: id,name,quantity,date
#define FILE_CONNECTIONS    "connections.txt"  // Adjacency matrix
#define FILE_WEIGHTS        "weights.txt"      // Weight matrix

// ===========================================================================
// SORTING - Default sort behavior
// ===========================================================================
#define DEFAULT_SORT_FIELD  0              // 0=ID, 1=Name, 2=Quantity, 3=Date
#define SORT_ASCENDING      true           // false = descending order

// ===========================================================================
// DISPLAY WIDTHS - Column widths for table output
// ===========================================================================
#define COL_ID              8              // Width of ID column
#define COL_NAME            20             // Width of Name column
#define COL_QTY             12             // Width of Quantity column
#define COL_DATE            12             // Width of Date column
#define COL_MATRIX          5              // Width of matrix cells

// ===========================================================================
// GRAPH CONSTANTS - Internal values (usually no need to change)
// ===========================================================================
#define NO_CONN             0              // No connection in adjacency matrix
#define NO_WEIGHT           -1             // No weight assigned

#endif // CONFIG_H
