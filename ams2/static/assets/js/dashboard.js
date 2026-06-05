document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       MODULE TOGGLE (SUBMENU OPEN/CLOSE)
       =============================== */
    document.querySelectorAll(".module-toggle").forEach(toggle => {
        toggle.addEventListener("click", () => {
            const menuItem = toggle.closest(".menu-item");

            // Close other open modules
            document.querySelectorAll(".menu-item.active").forEach(item => {
                if (item !== menuItem) {
                    item.classList.remove("active");
                }
            });

            // Toggle current module
            menuItem.classList.toggle("active");
        });
    });

    /* ===============================
       SUBMENU LINK ACTIVE STATE
       =============================== */
    document.querySelectorAll(".submenu-link").forEach(link => {
        link.addEventListener("click", () => {

            // Remove active from all submenu links
            document.querySelectorAll(".submenu-link").forEach(l =>
                l.classList.remove("active")
            );

            link.classList.add("active");
        });
    });

    /* ===============================
       DASHBOARD / MAIN MENU ACTIVE
       =============================== */
    document.querySelectorAll(".menu-link[data-page]").forEach(link => {
        link.addEventListener("click", () => {

            // Remove active from all menu links
            document.querySelectorAll(".menu-link").forEach(l =>
                l.classList.remove("active")
            );

            link.classList.add("active");
        });
    });

    /* ===============================
       MOBILE SIDEBAR TOGGLE
       =============================== */
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebar-toggle");

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

    /* ===============================
       AUTO-EXPAND AND HIGHLIGHT ACTIVE MENU
       =============================== */
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
    document.querySelectorAll(".sidebar-menu a").forEach(link => {
        if (link.href) {
            const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "") || "/";
            if (linkPath === currentPath) {
                link.classList.add("active");
                // If it is inside a submenu, open the parent module
                const parentModule = link.closest(".menu-item");
                if (parentModule) {
                    parentModule.classList.add("active");
                }
            }
        }
    });

});
