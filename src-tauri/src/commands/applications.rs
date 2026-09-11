use crate::applications::manifest::ApplicationManifest;
use crate::applications::scanner::read_application_manifests;
use crate::domain::response::ApiResponse;

#[tauri::command]
pub async fn list_applications() -> Result<ApiResponse<Vec<ApplicationManifest>>, String> {
    Ok(ApiResponse::success(read_application_manifests()?))
}
