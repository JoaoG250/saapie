<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  ProcessesQueryNode,
  ProcessesQueryResult,
  ProcessesQueryVariables,
  PROCESSES_QUERY,
} from "src/apollo/queries";
import { PageInfo, ProcessWhereInput } from "src/interfaces";
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ProcessList from "src/components/process/ProcessList.vue";
import { QInfiniteScrollProps } from "quasar";
import ProcessFilter from "src/components/process/ProcessFilter.vue";

const route = useRoute();
const router = useRouter();
const processes = ref<ProcessesQueryNode[]>([]);
const pageInfo = ref<PageInfo>();
const variables = computed<ProcessesQueryVariables>(() => {
  return {
    first: 30,
    where: {
      name: getQueryStringParam("name"),
      processCategory: getQueryStringParam("processCategory"),
    },
  };
});

function getQueryStringParam(param: string) {
  const value = route.query[param];
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

const { onResult, fetchMore } = useQuery<
  ProcessesQueryResult,
  ProcessesQueryVariables
>(PROCESSES_QUERY, variables, { fetchPolicy: "network-only" });
onResult((result) => {
  processes.value = result.data.processes.edges.map((edge) => edge.node);
  pageInfo.value = result.data.processes.pageInfo;
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
        processes: {
          ...fetchMoreResult.processes,
          edges: prev.processes.edges.concat(fetchMoreResult.processes.edges),
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

function onFilter(data: ProcessWhereInput) {
  router.push({ query: { ...data } });
}
</script>

<template>
  <q-page class="container">
    <div class="q-mb-md">
      <ProcessFilter @filter="onFilter" />
    </div>
    <q-infinite-scroll :offset="250" @load="onLoad">
      <ProcessList :processes="processes" />
      <template #loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<style scoped></style>
