<script lang="ts">
    import "../app.css"
    import { signIn, signOut } from "@auth/sveltekit/client"
    import { goto, afterNavigate } from "$app/navigation"
    import { page } from "$app/stores"
    import {
        Avatar,
        Breadcrumb,
        BreadcrumbItem,
        CloseButton,
        DarkMode,
        Drawer,
        Popover,
        Sidebar,
        SidebarDropdownItem,
        SidebarDropdownWrapper,
        SidebarGroup,
        SidebarItem,
        SidebarWrapper,
        Spinner
    } from "flowbite-svelte"
    import {
        UsersSolid,
        AnnotationSolid,
        DrawSquareOutline,
        HomeSolid,
        BarsOutline,
        LockOpenOutline,
        LockOutline,
        UserCircleOutline,
        ArrowLeftToBracketOutline,
        DrawSquareSolid,
        SunSolid,
        MoonSolid,
        AwardSolid
    } from "flowbite-svelte-icons"
    import { sineIn } from "svelte/easing"
    import { onMount } from "svelte"
    import type { LayoutData } from "./$types"
    import { _toLeftRightCenter } from "chart.js/helpers"
    import { dev } from "$app/environment"
    import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit"

    let hidden2 = true
    let transitionParams = {
        width: "w-40",
        duration: 200,
        easing: sineIn
    }

    function hideNavBar() {
        hidden2 = true
    }

    let doing_login = false
    function login() {
        signIn("google")
        doing_login = true
    }

    function logout() {
        signOut()
        doing_login = false
    }

    function _generateBreadcrums() {
        const currentURL = $page.url.pathname
        const urlSegments = currentURL.split("/").filter(segment => segment !== "")
        let _breadcrumItems = []
        let text: String
        let inTaquillas = false
        let inEdificio = true
        let inOsciloscopios = false
        for (let i = 0; i < urlSegments.length; i++) {
            text =
                urlSegments[i].charAt(0).toUpperCase() + urlSegments[i].slice(1).replace("_", " ")
            if (inTaquillas) {
                if (inEdificio) {
                    text = "Edificio " + text
                    inEdificio = false
                } else {
                    text = "Planta " + text
                }
            }

            if (inOsciloscopios) {
                text = "Puesto " + text
            }

            if (text === "Taquillas") {
                inTaquillas = true
            } else if (text === "Osciloscopio") {
                inOsciloscopios = true
                text = "Puestos"
            }

            _breadcrumItems.push({
                text: text,
                href: `/${urlSegments.slice(0, i + 1).join("/")}`
            })
        }
        return _breadcrumItems
    }

    let breadcrumItems: any[] = []
    onMount(() => {
        breadcrumItems = _generateBreadcrums()
        function checkEmailDomain(email: String | null | undefined) {
            if (email != null)
                if (!session?.user?.email?.endsWith("uc3m.es")) {
                    console.log("Inicia sesión con un correo adecuado", session?.user?.email)
                    signOut()
                }
        }
        checkEmailDomain(session?.user?.email)
    })

    afterNavigate(() => {
        breadcrumItems = _generateBreadcrums()
    })

    $: session = $page.data.session
    $: authorizedEmailsEscuela = $page.data.authorizedEmailsLayoutEscuela
    $: authorizedEmailsDespacho = $page.data.authorizedEmailsLayoutDespacho

    let theme = "light"

    onMount(() => {
        // Al montar, lee el tema de localStorage (si existe)
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme) {
            theme = savedTheme
            document.documentElement.classList.add(theme)
        } else {
            document.documentElement.classList.add("light")
        }
        injectSpeedInsights()
    })

    function setTheme(newTheme: string) {
        // Remueve todas las clases de tema antes de añadir la nueva
        document.documentElement.classList.remove("light", "dark", "recompensa")
        document.documentElement.classList.add(newTheme)

        // Actualiza el tema y guarda la preferencia
        theme = newTheme
        localStorage.setItem("theme", newTheme)
    }

    const correos_premiados = [
        "100472310@alumnos.uc3m.es",
        "100472175@alumnos.uc3m.es",
        "100495832@alumnos.uc3m.es",
        "100550037@alumnos.uc3m.es",
        "100522166@alumnos.uc3m.es"
    ]

    // Improve accessibility and SEO with better page titles
    $: pageTitle = generatePageTitle($page.url.pathname)

    /**
     * Generates a descriptive page title based on the current route
     * @param {string} path - The current URL path
     * @returns {string} - A formatted page title
     */
    function generatePageTitle(path: string): string {
        const baseName = "Delegación EPS UC3M"
        if (path === "/") return `Servicios de ${baseName}`

        const segments = path.split("/").filter(segment => segment !== "")
        if (segments.length === 0) return baseName

        // Convert path segments to readable titles
        const pageName = segments[segments.length - 1]
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")

        return `${pageName} | ${baseName}`
    }
</script>

<svelte:head>
    <title>{pageTitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap"
    rel="stylesheet" />

<body
    class="dark:bg-dark-background recompensa:bg-recompensa-background selection:bg-[#FFB300] selection:text-white">
    <header
        class="bg-dele-color grid sm:grid-cols-5 grid-cols-4 gap-x-4 md:gap-x-10 dark:bg-dark-primary recompensa:bg-recompensa-primary navbar sticky top-0 z-50 shadow-md">
        <button
            class="sm:w-12 sm:h-12 w-16 h-10"
            on:click={() => (hidden2 = !hidden2)}
            aria-label="Abrir menú de navegación">
            <BarsOutline class="sm:w-10 sm:h-10 w-8 h-8 ml-2" />
        </button>
        <a href="/" class="sm:block hidden p-1" aria-label="Inicio">
            <img
                class="sm:w-12 sm:h-auto w-10 h-auto bg-white dark:bg-dark-primary recompensa:bg-recompensa-primary rounded-xl p-1"
                src="/eps_logo.png"
                alt="Logo Delegación EPS" />
        </a>
        <button
            class="font-bold-italic text-white text-center py-2 lg:text-2xl sm:text-xl text-base hover:underline w-auto"
            on:click={() => {
                goto("/")
            }}
            aria-label="Ir a la página principal">
            Delegación EPS
        </button>
        {#if session}
            <div class="grid sm:grid-cols-12 grid-cols-1 place-items-center rtl:space-x-reverse">
                <div class="sm:block hidden col-span-9">
                    <a href="/perfil" class="">
                        <p class="text-white italic text-center text-xs lg:text-sm">
                            {session.user?.name}
                        </p>
                    </a>
                </div>
                <div class="min-w-10 w-auto ml-12 col-span-3">
                    <a href="/perfil" class="">
                        <Avatar src={session?.user?.image} class="h-10 w-10" />
                    </a>
                </div>
            </div>
            <button
                on:click={() => logout()}
                class="bg-red-500 rounded-3xl h-10 w-10 place-self-center">
                <ArrowLeftToBracketOutline class="h-8 w-8 m-auto" />
            </button>
        {:else}
            {#if doing_login}
                <div class="text-right mt-2">
                    <Spinner size={8} color="red" />
                </div>
            {:else}
                <div></div>
            {/if}
            <button
                on:click={() => login()}
                class="bg-white rounded-3xl h-10 w-10 place-self-center"
                id="pop_account">
                <UserCircleOutline class="h-8 w-8 m-auto" />
            </button>
        {/if}
    </header>

    <Popover
        class="text-black dark:text-white dark:bg-dark-secondary recompensa:bg-recompensa-secondary md:w-1/3 sm:w-1/2 w-10/12 sm:text-md text-sm"
        title="Cuenta de la UC3M"
        triggeredBy="#pop_account">
        <p class=" dark:text-white recompensa:text-white text-sm sm:text-base text-justify">
            Recuerda iniciar sesión con tu cuenta de la universidad
        </p>
    </Popover>

    <nav aria-label="Breadcrumb">
        <Breadcrumb
            solidClass="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-none bg-gray-50 dark:bg-[#111719] dark:border-black recompensa:bg-recompensa-secondary recompensa:border-white recompensa:border-x-0 recompensa:border-t-0"
            aria-label="Navegación de migas de pan"
            solid>
            <BreadcrumbItem
                homeClass="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:recompensa:text-white recompensa:text-recompensa-primary hover:underline"
                href="/"
                home>
                Inicio
            </BreadcrumbItem>
            {#each breadcrumItems as item, index}
                <BreadcrumbItem
                    linkClass="ms-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ms-2 dark:text-gray-400 dark:hover:text-white hover:recompensa:text-white recompensa:text-recompensa-primary hover:underline"
                    href={item.href}
                    aria-current={index === breadcrumItems.length - 1 ? "page" : undefined}>
                    {item.text}
                </BreadcrumbItem>
            {/each}
        </Breadcrumb>
    </nav>

    <Drawer
        transitionType="fly"
        {transitionParams}
        bind:hidden={hidden2}
        id="sidebar2"
        divClass="overflow-y-auto z-50 p-4 bg-white dark:bg-dark-secondary recompensa:bg-recompensa-secondary">
        <div class="flex items-center">
            <h5
                id="drawer-navigation-label-3"
                class="text-base font-semibold text-gray-600 uppercase dark:text-gray-400 recompensa:text-recompensa-primary recompensa:text-gray-400">
                Menu de Navegación
            </h5>
            <CloseButton
                on:click={() => (hidden2 = true)}
                class="mb-4 dark:text-white recompensa:text-recompensa-primary" />
        </div>
        <Sidebar>
            <SidebarWrapper
                divClass="overflow-y-auto py-4 px-3 rounded dark:bg-dark-secondary recompensa:bg-recompensa-secondary">
                <SidebarGroup>
                    <SidebarItem
                        class="recompensa:text-recompensa-primary hover:recompensa:bg-[#E0E0E0]"
                        label="Inicio"
                        href="/"
                        on:click={() => hideNavBar()}>
                        <svelte:fragment slot="icon">
                            <HomeSolid
                                class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 recompensa:text-recompensa-primary group-hover:text-gray-900 dark:group-hover:text-white" />
                        </svelte:fragment>
                    </SidebarItem>
                    {#await session then}
                        {#if session?.user?.email != null}
                            <SidebarItem
                                class="recompensa:text-recompensa-primary hover:recompensa:bg-[#E0E0E0]"
                                label="Perfil"
                                href="/perfil"
                                on:click={() => hideNavBar()}>
                                <svelte:fragment slot="icon">
                                    <UserCircleOutline
                                        class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 recompensa:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white
										recompensa:group-hover:text-white" />
                                </svelte:fragment>
                            </SidebarItem>
                        {/if}
                    {/await}
                    <SidebarItem
                        class="recompensa:text-recompensa-primary hover:recompensa:bg-[#E0E0E0]"
                        label="Taquillas"
                        href="/taquillas"
                        on:click={() => hideNavBar()}>
                        <svelte:fragment slot="icon">
                            <LockOpenOutline
                                class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 recompensa:text-gray-400
								 group-hover:text-gray-900 dark:group-hover:text-white recompensa:group-hover:text-white" />
                        </svelte:fragment>
                    </SidebarItem>
                    {#await authorizedEmailsDespacho then}
                        {#await session then}
                            {#if session?.user?.email != null}
                                {#if authorizedEmailsDespacho != null && authorizedEmailsDespacho.includes(session?.user?.email) == true}
                                    <SidebarItem
                                        class="recompensa:text-recompensa-primary hover:recompensa:bg-[#E0E0E0]"
                                        label="Gestionar Taquillas"
                                        href="/gestion_taquillas"
                                        on:click={() => hideNavBar()}>
                                        <svelte:fragment slot="icon">
                                            <LockOutline
                                                class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 recompensa:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white recompensa:group-hover:text-white" />
                                        </svelte:fragment>
                                    </SidebarItem>
                                {/if}
                            {/if}
                        {/await}
                    {/await}

                    <SidebarItem
                        class="recompensa:text-recompensa-primary hover:recompensa:bg-[#E0E0E0]"
                        label="Puestos de Electrónica"
                        href="/osciloscopio"
                        on:click={() => hideNavBar()}>
                        <svelte:fragment slot="icon">
                            <DrawSquareOutline
                                class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 recompensa:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white recompensa:group-hover:text-white" />
                        </svelte:fragment>
                    </SidebarItem>
                    {#await authorizedEmailsDespacho then}
                        {#await session then}
                            {#if session?.user?.email != null}
                                {#if authorizedEmailsDespacho != null && authorizedEmailsDespacho.includes(session?.user?.email) == true}
                                    <SidebarItem
                                        class="recompensa:text-recompensa-primary hover:recompensa:bg-[#E0E0E0]"
                                        label="Gestionar Puestos"
                                        href="/gestion_osciloscopios"
                                        on:click={() => hideNavBar()}>
                                        <svelte:fragment slot="icon">
                                            <DrawSquareSolid
                                                class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 recompensa:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white recompensa:group-hover:text-white" />
                                        </svelte:fragment>
                                    </SidebarItem>
                                {/if}
                            {/if}
                        {/await}
                    {/await}

                    {#await authorizedEmailsEscuela then}
                        {#await session then}
                            {#if session?.user?.email != null}
                                {#if authorizedEmailsEscuela != null && authorizedEmailsEscuela.includes(session?.user?.email) == true}
                                    <SidebarItem
                                        class="recompensa:text-recompensa-primary hover:recompensa:bg-[#E0E0E0]"
                                        label="Admin"
                                        href="/admin"
                                        on:click={() => hideNavBar()}>
                                        <svelte:fragment slot="icon">
                                            <UsersSolid
                                                class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 recompensa:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white recompensa:group-hover:text-white" />
                                        </svelte:fragment>
                                    </SidebarItem>
                                {/if}
                            {/if}
                        {/await}
                    {/await}
                    <SidebarItem
                        class="recompensa:text-recompensa-primary hover:recompensa:bg-[#E0E0E0]"
                        label="Encuestas"
                        href="/encuestas"
                        on:click={() => (hidden2 = !hidden2)}>
                        <svelte:fragment slot="icon">
                            <AnnotationSolid
                                class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 recompensa:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white recompensa:group-hover:text-white" />
                        </svelte:fragment>
                    </SidebarItem>

                    <p class="text-center dark:text-white recompensa:text-white">Temas</p>

                    {#if correos_premiados && correos_premiados.includes(session?.user?.email)}
                        <div class="grid grid-cols-3 place-items-center">
                            <button
                                on:click={() => setTheme("light")}
                                class="p-2 bg-gray-200 rounded-md">
                                <SunSolid />
                            </button>
                            <button
                                on:click={() => setTheme("dark")}
                                class="p-2 bg-gray-800 text-white rounded-md">
                                <MoonSolid />
                            </button>
                            <button
                                on:click={() => setTheme("recompensa")}
                                class="p-2 bg-yellow-500 text-white rounded-md">
                                <AwardSolid />
                            </button>
                        </div>
                    {:else}
                        <div class="grid grid-cols-2 place-items-center">
                            <button
                                on:click={() => setTheme("light")}
                                class="p-2 bg-gray-200 rounded-md">
                                <SunSolid />
                            </button>
                            <button
                                on:click={() => setTheme("dark")}
                                class="p-2 bg-gray-800 text-white rounded-md">
                                <MoonSolid />
                            </button>
                        </div>
                    {/if}
                </SidebarGroup>
            </SidebarWrapper>
        </Sidebar>
    </Drawer>

    <slot />
</body>
