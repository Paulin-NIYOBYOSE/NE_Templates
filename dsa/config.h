/**
 * ===========================================================================
 * DSA PRACTICAL EXAM TEMPLATE - CONFIGURATION FILE
 * ===========================================================================
 * 
 * QUICK ADAPTATION (5 minutes):
 * 1. Set MODE: USE_COMMAND_MODE or USE_MENU_MODE
 * 2. Set ENTITY names: ENTITY_SINGULAR, ENTITY_PLURAL
 * 3. Set FIELD labels: FIELD_ID, FIELD_NAME, FIELD_QUANTITY, FIELD_DATE
 * 4. Enable/disable features: HAS_QUANTITY, HAS_DATE, ENABLE_GRAPH
 * 5. Set file names: FILE_ITEMS, FILE_CONNECTIONS, FILE_WEIGHTS
 * 
 * SCENARIOS:
 *   Inventory:  Item/Items,    Quantity,   Date,       Dependency
 *   Roads:      City/Cities,   Population, Founded,    Road
 *   Students:   Student/Students, Score,   Enrolled,   Friendship
 *   Library:    Book/Books,    Copies,     Published,  Reference
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
// FEATURE TOGGLES
// ===========================================================================
#define HAS_QUANTITY        true   // Enable quantity/score/population field
#define HAS_DATE            true   // Enable date field
#define ENABLE_GRAPH        true   // Enable adjacency matrix & relations
#define GRAPH_UNDIRECTED    true   // true = bidirectional, false = directed
#define ALLOW_DUPLICATE_NAMES false // Allow same name for different IDs
#define AUTO_SORT           true   // Sort after add/edit
#define SEED_ON_START       false  // Populate sample data on first run

// ===========================================================================
// ENTITY & RELATION NAMES
// ===========================================================================
#define ENTITY_SINGULAR     "Item"
#define ENTITY_PLURAL       "Items"
#define RELATION_NAME       "Connection"   // Road, Dependency, Friendship
#define CMD_PREFIX          ""             // Command prefix (empty or "item")

// ===========================================================================
// FIELD LABELS (for display and prompts)
// ===========================================================================
#define FIELD_ID            "ID"
#define FIELD_NAME          "Name"
#define FIELD_QUANTITY      "Quantity"     // Budget, Population, Score, Copies
#define FIELD_DATE          "Date"         // Founded, Enrolled, Published

// ===========================================================================
// VALIDATION LIMITS
// ===========================================================================
#define MAX_ENTITIES        100
#define MIN_ID              1
#define MAX_ID              9999
#define MAX_NAME_LEN        50
#define MIN_QUANTITY        0
#define MAX_QUANTITY        1000000
#define DATE_FMT            "YYYY-MM-DD"

// ===========================================================================
// FILE NAMES
// ===========================================================================
#define FILE_ITEMS          "items.csv"
#define FILE_CONNECTIONS    "connections.txt"
#define FILE_WEIGHTS        "weights.txt"

// ===========================================================================
// SORTING (0=ID, 1=Name, 2=Quantity, 3=Date)
// ===========================================================================
#define DEFAULT_SORT_FIELD  0
#define SORT_ASCENDING      true

// ===========================================================================
// DISPLAY WIDTHS
// ===========================================================================
#define COL_ID              8
#define COL_NAME            20
#define COL_QTY             12
#define COL_DATE            12
#define COL_MATRIX          5

// ===========================================================================
// GRAPH CONSTANTS
// ===========================================================================
#define NO_CONN             0
#define NO_WEIGHT           -1

#endif // CONFIG_H
