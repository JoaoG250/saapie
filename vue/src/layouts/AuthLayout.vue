<script setup lang="ts"></script>

<template>
  <q-layout view="hHh LpR lfr">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title> SAAPIE </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title> </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style scoped></style>
