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
];
</script>

<template>
  <q-page>
    <div class="container">
      <div class="row q-col-gutter-md">
        <template v-for="(model, index) in models" :key="index">
          <div class="col-12 col-md-5">
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
        </template>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
