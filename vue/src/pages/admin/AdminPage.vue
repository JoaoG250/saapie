<script setup lang="ts">
interface Model {
  name: string;
  icon: string;
  description: string;
  to: { name: string };
}

const models: Model[] = [
  {
    name: "Usuário",
    icon: "person",
    description: "Página de administração do modelo de usuário",
    to: { name: "admin:user" },
  },
  {
    name: "Grupo",
    icon: "group",
    description: "Página de administração do modelo de grupo",
    to: { name: "admin:group" },
  },
  {
    name: "Processo",
    icon: "work",
    description: "Página de administração do modelo de processo",
    to: { name: "admin:process" },
  },
  {
    name: "Pedidos de abertura de processo",
    icon: "assignment",
    description: "Página de administração dos pedidos de abertura de processo",
    to: { name: "admin:process-request" },
  },
  {
    name: "Categorias de processos",
    icon: "category",
    description: "Página de administração de categorias de processos",
    to: { name: "admin:process-category" },
  },
];
</script>

<template>
  <q-page>
    <div class="container">
      <div class="row justify-evenly q-col-gutter-md">
        <template v-for="(model, index) in models" :key="index">
          <div class="col-12 col-md-5">
            <div class="row justify-center">
              <q-card style="max-width: 344px">
                <q-card-section horizontal>
                  <q-card-section class="q-pt-xs">
                    <div class="text-h5 q-mt-sm q-mb-xs">{{ model.name }}</div>
                    <div class="text-caption text-grey">
                      {{ model.description }}
                    </div>
                  </q-card-section>
                  <q-card-section class="col-5 flex flex-center">
                    <q-icon :name="model.icon" size="4rem" />
                  </q-card-section>
                </q-card-section>
                <q-separator />
                <q-card-actions align="right">
                  <q-btn :to="model.to" color="primary" label="Entrar" />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </template>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
