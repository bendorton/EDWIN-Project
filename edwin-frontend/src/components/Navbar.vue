<template>
    <nav>
        <v-app-bar flat app class="grey darken-2">
            <v-app-bar-nav-icon class="white--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-btn href="/" text color="white">
                <v-toolbar-title class="text-uppercase white--text">
                    <span class="font-weight-light">Edwin</span>
                    <span>Project</span>
                </v-toolbar-title>
            </v-btn>
            <v-spacer></v-spacer>
            
            <v-btn href="http://edwinproject.org/" target="_blank" text color="white">
                <span>News</span>
                <v-icon right>link</v-icon>
            </v-btn>
            
            <v-spacer></v-spacer>
            
            <div v-if="!$auth.loading">
                <span>
                    <v-btn v-if="!$auth.isAuthenticated" @click="login">Log in</v-btn>
                    <v-btn v-if="$auth.isAuthenticated" @click="logout">Log out</v-btn>
                </span>
                &nbsp;
                <span>
                    <a v-if="$auth.isAuthenticated" href="/Profile" title="Profile">
                        <img
                        :src="$auth.user.picture"
                        alt="profile"
                        class="v-avatar"
                        width="50"
                        />
                    </a>
                </span>
            </div>



            
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
                { icon: 'videocam', text: 'Dashboard', route: '/Dashboard' },
                // { icon: 'account_circle', text: 'My Profile', route: '/profile' },
                { icon: 'supervisor_account', text: 'Admin', route: '/team' },
                // { icon: 'input', text: 'Login', route: '/' },
            ]
        }
    },

    methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      })
    }
  }

}
</script>