//! App Registry：扫描 tools/**/manifest.json，产出应用列表。
use std::{fs, path::PathBuf};

use crate::applications::manifest::ApplicationManifest;

pub fn applications_dir() -> Result<PathBuf, String> {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let repo_root = manifest_dir
        .parent()
        .ok_or_else(|| "failed to resolve repository root from src-tauri".to_string())?;

    Ok(repo_root.join("applications"))
}

pub fn read_application_manifests() -> Result<Vec<ApplicationManifest>, String> {
    let applications_dir = applications_dir()?;

    if !applications_dir.exists() {
        return Ok(Vec::new());
    }

    let mut manifests = Vec::new();

    for entry in fs::read_dir(&applications_dir).map_err(|error| {
        format!(
            "failed to read tools directory {:?}: {error}",
            applications_dir
        )
    })? {
        let entry = entry.map_err(|error| format!("failed to read tools entry: {error}"))?;
        let path = entry.path();

        if !path.is_dir() {
            continue;
        }

        let manifest_path = path.join("manifest.json");

        if !manifest_path.exists() {
            continue;
        }

        let manifest_text = fs::read_to_string(&manifest_path)
            .map_err(|error| format!("failed to read {:?}: {error}", manifest_path))?;
        let manifest = serde_json::from_str::<ApplicationManifest>(&manifest_text)
            .map_err(|error| format!("failed to parse {:?}: {error}", manifest_path))?;

        manifests.push(manifest);
    }

    Ok(manifests)
}
