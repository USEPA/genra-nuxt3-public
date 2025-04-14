import {LicenseManager} from 'ag-grid-enterprise';
import {AgGridVue} from 'ag-grid-vue3';

export default defineNuxtPlugin(() => {
  LicenseManager.setLicenseKey('CompanyName=United States Environmental Protection Agency,LicensedGroup=Wade Slate,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-030324,SupportServicesEnd=3_December_2024_[v2]_MTczMzE4NDAwMDAwMA==fdf9944cbd70383b5fad44ca373062a0');
  return {
    provide: {
      AgGridVue: AgGridVue,
    },
  };
});
