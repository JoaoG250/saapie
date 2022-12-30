<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  ProcessCategoriesQueryNode,
  ProcessCategoriesQueryResult,
  ProcessCategoriesQueryVariables,
  PROCESS_CATEGORIES_QUERY,
} from "src/apollo/queries";
import { PageInfo } from "src/interfaces";
import { ref } from "vue";
import { QInfiniteScrollProps } from "quasar";
import ProcessCategoryList from "src/components/process/ProcessCategoryList.vue";

const processCategories = ref<ProcessCategoriesQueryNode[]>([]);
const pageInfo = ref<PageInfo>();
const variables = ref<ProcessCategoriesQueryVariables>({
  first: 30,
});

const { onResult, fetchMore } = useQuery<
  ProcessCategoriesQueryResult,
  ProcessCategoriesQueryVariables
>(PROCESS_CATEGORIES_QUERY, variables, { fetchPolicy: "network-only" });
onResult((result) => {
  processCategories.value = result.data.processCategories.edges.map(
    (edge) => edge.node
  );
  pageInfo.value = result.data.processCategories.pageInfo;
});

const onLoad: QInfiniteScrollProps["onLoad"] = async (_index, done) => {
  if (!pageInfo.value) {
    done();
    return;
  }
  if (!pageInfo.value.hasNextPage) {
    done(true);
    return;
  }
  await fetchMore({
    variables: {
      first: variables.value.first,
      after: pageInfo.value.endCursor,
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return prev;
      }
      return {
        processCategories: {
          ...fetchMoreResult.processCategories,
          edges: prev.processCategories.edges.concat(
            fetchMoreResult.processCategories.edges
          ),
        },
      };
    },
  });
  if (!pageInfo.value.hasNextPage) {
    done(true);
    return;
  }
  done();
};
</script>

<template>
  <q-page class="container">
    <q-infinite-scroll :offset="250" @load="onLoad">
      <ProcessCategoryList :process-categories="processCategories" />
      <template #loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<style scoped></style>
