<template>
  <v-data-table :headers="headers" :items="requests" class="elevation-1">
    <template slot="items" slot-scope="props">
      <td>{{ props.item.number }}</td>
      <td class="text-xs-left">{{ props.item.date }}</td>
      <td class="text-xs-left">{{ props.item.software }}</td>
      <td class="text-xs-left">{{ props.item.criticality }}</td>
      <td class="text-xs-left">{{ props.item.incident_wording }}</td>
      <td class="text-xs-left">{{ props.item.severity }}</td>
      <td class="text-xs-left">{{ props.item.status }}</td>
      <td class="text-xs-left">{{ props.item.transmitter }}</td>
      <td class="text-xs-left">{{ props.item.responsible }}</td>
      <td class="text-xs-left">
        <a href="#">{{ props.item.voir }}</a>
      </td>
    </template>
  </v-data-table>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        { text: "N°", value: "number" },
        { text: "Date", value: "date" },
        { text: "Software", value: "software" },
        { text: "Criticality", value: "criticality" },
        { text: "Incident wording", value: "incident_wording" },
        { text: "Severity", value: "severity" },
        { text: "Status", value: "status" },
        { text: "Transmitter", value: "transmitter" },
        { text: "Responsible", value: "responsible" },
        { text: "voir", value: "voir" }
      ],
      requests: [
        {
          number: 1,
          date: "10/03/2018",
          software: "Elastic search",
          criticality: "Standard",
          incident_wording: "Dysfonctionnement facettes",
          severity: "Bloquant",
          status: "Contournement",
          transmitter: "Dupon",
          responsible: "Vromin",
          voir: "VOIR"
        },
        {
          number: 2,
          date: "12/03/2018",
          software: "GLPI",
          criticality: "Standard",
          incident_wording: "Infos manquantes Formulaire de création",
          severity: "Non Bloquant",
          status: "Rappel Utilisateur",
          transmitter: "Martin",
          responsible: "Dufon",
          voir: "VOIR"
        },
        {
          number: 3,
          date: "10/04/2018",
          software: "Redis",
          criticality: "Critique",
          incident_wording: "problème de lock",
          severity: "Bloquant",
          status: "Solution définitive",
          transmitter: "Bernas",
          responsible: "Maudu",
          voir: "VOIR"
        },
        {
          number: 4,
          date: "10/05/2018",
          software: "AngularJS",
          criticality: "standard",
          incident_wording: "Fuite mémoire",
          severity: "Bloquant",
          status: "Réponse demande",
          transmitter: "Bacron",
          responsible: "Chapy",
          voir: "VOIR"
        },
        {
          number: 5,
          date: "22/05/2018",
          software: "NPM",
          criticality: "standard",
          incident_wording: "Problème de droits",
          severity: "Bloquant",
          status: "Contournement",
          transmitter: "Jorac",
          responsible: "Moutou",
          voir: "VOIR"
        }
      ]
    };
  }
};
</script>
<style type="text/css">
.elevation-1 {
  width: 100% !important;
}
</style>
