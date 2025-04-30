//GLOBAL COMPONENTS
import { createApp } from "vue";

//UI Components
import InfoCard from "@/components/ui/InfoCard.vue";
import NavBar from "@/components/ui/NavBar.vue";
import Background from "@/components/ui/Background.vue";
import SideDrawer from "@/components/ui/SideDrawer.vue";
import FloatingButton from "@/components/ui/FloatingButton.vue";
import BottomModal from "@/components/ui/BottomModal.vue";
import CenterModal from "@/components/ui/CenterModal.vue";
import AdminDropdown from "@/components/ui/AdminDropdown.vue";

// Home Components
import CategoryCard from "@/components/home/CategoryCard.vue";

// Search Components
import ResultCard from "@/components/search/ResultCard.vue";
import SortSelect from "@/components/search/SortSelect.vue";
import SearchBar from "@/components/search/SearchBar.vue";
import CategorySelect from "@/components/search/CategorySelect.vue";
import ResultPaginator from "@/components/search/ResultPaginator.vue";
import TagsSelect from "@/components/search/TagsSelect.vue";

// Map Components
import FormMapView from "@/components/map/FormMapView.vue";
import BigMapView from "@/components/map/BigMapView.vue";
import GpsMapHidden from "@/components/map/GpsMapHidden.vue";
import Minimap from "@/components/map/Minimap.vue";

// Details Components
import DirectionsTabItem from "@/components/details/DirectionsTabItem.vue";
import DescriptionTabItem from "@/components/details/DescriptionTabItem.vue";
import ImagesTabItem from "@/components/details/ImagesTabItem.vue";
import NearbyLocationsTabItem from "@/components/details/NearbyLocationsTabItem.vue";
import SubareaTabItem from "@/components/details/SubareaTabItem.vue";
import MainBuildingTabItem from "@/components/details/MainBuildingTabItem.vue";

// Admin Page Components
import CategoryDropdown from "@/components/admin/CategoryDropdown.vue";
import CategoryTable from "@/components/admin/CategoryTable.vue";
import TagTable from "@/components/admin/TagTable.vue";

// Admin Result Components
import AdminResultCard from "@/components/admin/AdminResultCard.vue";
import AdminSortSelect from "@/components/admin/AdminSortSelect.vue";
import AdminSearchBar from "@/components/admin/AdminSearchBar.vue";
import AdminCategorySelect from "@/components/admin/AdminCategorySelect.vue";
import AdminTagsSelect from "@/components/admin/AdminTagsSelect.vue";

// Create a new Vue app and register components globally
const app = createApp({});

// Register UI components
app.component("NavBar", NavBar);
app.component("Background", Background);
app.component("InfoCard", InfoCard);
app.component("SideDrawer", SideDrawer);
app.component("FloatingButton", FloatingButton);
app.component("BottomModal", BottomModal);
app.component("CenterModal", CenterModal);
app.component("AdminDropdown", AdminDropdown);

// Home components
app.component("CategoryCard", CategoryCard);

// Search components
app.component("ResultCard", ResultCard);
app.component("SortSelect", SortSelect);
app.component("SearchBar", SearchBar);
app.component("CategorySelect", CategorySelect);
app.component("ResultPaginator", ResultPaginator);
app.component("TagsSelect", TagsSelect);

// Map components
app.component("FormMapView", FormMapView);
app.component("BigMapView", BigMapView);
app.component("GpsMapHidden", GpsMapHidden);
app.component("Minimap", Minimap);

// Details components
app.component("DirectionsTabItem", DirectionsTabItem);
app.component("ImagesTabItem", ImagesTabItem);
app.component("DescriptionTabItem", DescriptionTabItem);
app.component("NearbyLocationsTabItem", NearbyLocationsTabItem);
app.component("SubareaTabItem", SubareaTabItem);
app.component("MainBuildingTabItem", MainBuildingTabItem);

// Admin components
app.component("CategoryDropdown", CategoryDropdown);
app.component("CategoryTable", CategoryTable);
app.component("TagTable", TagTable);

// Admin Result components
app.component("AdminResultCard", AdminResultCard);
app.component("AdminSortSelect", AdminSortSelect);
app.component("AdminSearchBar", AdminSearchBar);
app.component("AdminCategorySelect", AdminCategorySelect);
app.component("AdminTagsSelect", AdminTagsSelect);

// Mount the app (ensure the app is mounted on an element in your main HTML file)
app.mount("#app");
