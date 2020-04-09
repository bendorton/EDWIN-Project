<template>
    <nav>
        <v-app-bar flat app class="grey darken-2">
            <v-app-bar-nav-icon class="white--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="text-uppercase white--text">
                <span class="font-weight-light">Edwin</span>
                <span>Project</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn href="http://edwinproject.org/" target="_blank" text color="white">
                <span>Marketing Site</span>
                <v-icon right>link</v-icon>
            </v-btn>
            <!-- <v-btn href="/" text color="white">
                <span>Sign Out</span>
                <v-icon right>exit_to_app</v-icon>
            </v-btn> -->
        </v-app-bar>
        <v-navigation-drawer app temporary v-model="drawer" class="teal lighten-1">
            <v-list class="teal lighten-1">
                <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
                    <v-list-item-icon>
                        <v-icon class="white--text">{{ link.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="white--text">{{ link.text }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            drawer: false,
            links: [
                { icon: 'videocam', text: 'Dashboard', route: '/' },
                { icon: 'account_circle', text: 'My Profile', route: '/profile' },
                { icon: 'supervisor_account', text: 'Group', route: '/team' },
                // { icon: 'input', text: 'Login', route: '/' },
            ]
        }
    }
}
</script>