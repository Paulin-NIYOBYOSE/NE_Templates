import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import {
  Text,
  FAB,
  Card,
  IconButton,
  Chip,
  Searchbar,
} from "react-native-paper";
import Toast from "react-native-toast-message";
import { useAppTheme } from "../../contexts/ThemeContext";
import { appConfig } from "../../config/appConfig";
import { EntityItem } from "../../types";
import { fetchItems, deleteItem } from "../../services/entityService";
import LoadingIndicator from "../../components/LoadingIndicator";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";

const ItemListScreen = ({ navigation }: any) => {
  const { theme } = useAppTheme();
  const [items, setItems] = useState<EntityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<EntityItem | null>(null);

  const load = useCallback(async (p = 1, refresh = false) => {
    try {
      if (p === 1) refresh ? setRefreshing(true) : setLoading(true);
      const { data, total } = await fetchItems(p, 10);
      if (p === 1) {
        setItems(data);
      } else {
        setItems((prev) => [...prev, ...data]);
      }
      setHasMore(p * 10 < total);
      setPage(p);
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Error", text2: err.message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", () => load(1));
    return unsub;
  }, [navigation, load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem(deleteTarget.id);
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      Toast.show({
        type: "success",
        text1: "Deleted",
        text2: `${appConfig.entityName.singular} removed`,
      });
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Error", text2: err.message });
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredItems = search
    ? items.filter((i) =>
        Object.values(i).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : items;

  const renderItem = ({ item }: { item: EntityItem }) => (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate("ItemForm", { item })}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurface, fontWeight: "600" }}
          >
            {String(item.name ?? item.id)}
          </Text>
          <View style={styles.chipRow}>
            {(item.category as string) ? (
              <Chip
                compact
                textStyle={{
                  fontSize: 11,
                  color: theme.colors.onPrimaryContainer,
                }}
                style={[
                  styles.chip,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                {String(item.category as string)}
              </Chip>
            ) : null}
            {item.amount !== undefined ? (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {appConfig.currency} {Number(item.amount).toLocaleString()}
              </Text>
            ) : null}
          </View>
          {item.createdAt && (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}
            >
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
        <View style={styles.cardActions}>
          <IconButton
            icon="pencil-outline"
            size={20}
            onPress={() => navigation.navigate("ItemForm", { item })}
          />
          <IconButton
            icon="delete-outline"
            size={20}
            iconColor={theme.custom.danger}
            onPress={() => setDeleteTarget(item)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  if (loading && items.length === 0) return <LoadingIndicator />;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Searchbar
        placeholder={`Search ${appConfig.entityName.plural.toLowerCase()}…`}
        value={search}
        onChangeText={setSearch}
        style={[
          styles.searchbar,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
        inputStyle={{ fontSize: 14 }}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={
          filteredItems.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-text-outline"
            title={`No ${appConfig.entityName.plural}`}
            subtitle={`Tap + to add your first ${appConfig.entityName.singular.toLowerCase()}`}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(1, true)}
          />
        }
        onEndReached={() => hasMore && load(page + 1)}
        onEndReachedThreshold={0.3}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#FFFFFF"
        onPress={() => navigation.navigate("ItemForm", {})}
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        message={`Delete "${String(deleteTarget?.name || deleteTarget?.id)}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchbar: { margin: 16, marginBottom: 8, borderRadius: 12, elevation: 0 },
  list: { padding: 16, paddingTop: 8 },
  emptyList: { flexGrow: 1 },
  card: { marginBottom: 12, borderRadius: 12 },
  cardContent: { flexDirection: "row", alignItems: "center" },
  cardLeft: { flex: 1 },
  chipRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  chip: { height: 24, borderRadius: 6 },
  cardActions: { flexDirection: "row" },
  fab: { position: "absolute", right: 20, bottom: 20, borderRadius: 16 },
});

export default ItemListScreen;
