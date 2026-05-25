import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Share,
} from "react-native";
import { Text, Surface, Button, Chip, IconButton } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useAppTheme } from "../../contexts/ThemeContext";
import { appConfig } from "../../config/appConfig";
import { fetchHistory } from "../../services/generateService";
import { GeneratedRecord } from "../../types";
import LoadingIndicator from "../../components/LoadingIndicator";
import EmptyState from "../../components/EmptyState";

const HistoryScreen = () => {
  const { theme } = useAppTheme();
  const [records, setRecords] = useState<GeneratedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterDays, setFilterDays] = useState<number | null>(null);

  const load = useCallback(
    async (refresh = false) => {
      try {
        refresh ? setRefreshing(true) : setLoading(true);
        const filters: Record<string, string> = {};
        if (filterDays) {
          const start = new Date();
          start.setDate(start.getDate() - filterDays);
          filters.startDate = start.toISOString();
        }
        const data = await fetchHistory(filters);
        setRecords(data);
      } catch (err: any) {
        Toast.show({ type: "error", text1: "Error", text2: err.message });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filterDays],
  );

  useEffect(() => {
    load();
  }, [load]);

  const exportCSV = async () => {
    if (records.length === 0) {
      Toast.show({
        type: "info",
        text1: "No Data",
        text2: "Nothing to export",
      });
      return;
    }

    const headers = "Token,Meter Number,Amount,Days,Date\n";
    const rows = records
      .map(
        (r) =>
          `${r.token},${r.meterNumber},${r.amount},${r.valueDays},${new Date(r.createdAt).toLocaleDateString()}`,
      )
      .join("\n");
    const csv = headers + rows;

    try {
      await Share.share({ message: csv, title: "History Export" });
      Toast.show({ type: "success", text1: "Exported", text2: "CSV shared" });
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Export Failed", text2: err.message });
    }
  };

  const renderItem = ({ item }: { item: GeneratedRecord }) => {
    const daysRemaining = Math.max(
      0,
      item.valueDays -
        Math.floor(
          (Date.now() - new Date(item.createdAt).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
    );
    const isActive = daysRemaining > 0;

    return (
      <Surface
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        elevation={1}
      >
        <View style={styles.cardHeader}>
          <View style={styles.tokenContainer}>
            <Text
              variant="titleMedium"
              style={{
                color: theme.colors.primary,
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              {item.token}
            </Text>
          </View>
          <Chip
            compact
            textStyle={{
              fontSize: 11,
              color: isActive ? "#10B981" : "#EF4444",
            }}
            style={{ backgroundColor: isActive ? "#10B98120" : "#EF444420" }}
          >
            {isActive ? "Active" : "Expired"}
          </Chip>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.detailItem}>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Meter
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurface }}
            >
              {item.meterNumber}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Amount
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurface }}
            >
              {appConfig.currency} {item.amount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Days
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: isActive ? "#10B981" : "#EF4444",
                fontWeight: "600",
              }}
            >
              {daysRemaining}/{item.valueDays}
            </Text>
          </View>
        </View>

        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
        >
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </Surface>
    );
  };

  if (loading && records.length === 0) return <LoadingIndicator />;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.filterRow}>
        <Chip
          selected={filterDays === null}
          onPress={() => setFilterDays(null)}
          style={styles.filterChip}
          compact
        >
          All
        </Chip>
        <Chip
          selected={filterDays === 7}
          onPress={() => setFilterDays(7)}
          style={styles.filterChip}
          compact
        >
          7 days
        </Chip>
        <Chip
          selected={filterDays === 30}
          onPress={() => setFilterDays(30)}
          style={styles.filterChip}
          compact
        >
          30 days
        </Chip>
        <Chip
          selected={filterDays === 90}
          onPress={() => setFilterDays(90)}
          style={styles.filterChip}
          compact
        >
          90 days
        </Chip>
        <IconButton icon="export-variant" size={20} onPress={exportCSV} />
      </View>

      <FlatList
        data={records}
        keyExtractor={(item, index) => item.token + index}
        renderItem={renderItem}
        contentContainerStyle={
          records.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={
          <EmptyState
            icon="history"
            title="No History"
            subtitle="Generated tokens will appear here"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 6,
  },
  filterChip: { height: 32 },
  list: { padding: 16 },
  emptyList: { flexGrow: 1 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tokenContainer: { flex: 1 },
  cardBody: { flexDirection: "row", marginTop: 12, gap: 16 },
  detailItem: { flex: 1 },
});

export default HistoryScreen;
