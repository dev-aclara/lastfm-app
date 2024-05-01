<template>
  <CardInfo />
</template>

<script>
import CardInfo from '@/components/CardInfo.vue';

export default {
  name: 'App',
  components: {
    CardInfo
  }
}
</script>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: rgb(122,116,111);
  background: linear-gradient(187deg, rgba(126,119,109,1) 0%, rgba(51,47,43,1) 35%, rgba(255,255,255,1) 100%);

}
</style>