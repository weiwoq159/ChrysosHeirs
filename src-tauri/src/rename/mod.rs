use std::{collections::HashMap, fs, path::Path};

use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RenameItemInput {
    source_path: String,
    target_name: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RenamePreviewItem {
    source_path: String,
    target_path: String,
    status: RenamePreviewStatus,
    error: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "lowercase")]
pub enum RenamePreviewStatus {
    Ready,
    Unchanged,
    Conflict,
    Invalid,
}

struct RenameCandidate {
    source_path: String,
    target_path: String,
    target_key: String,
    status: RenamePreviewStatus,
    error: Option<String>,
}

pub fn list_files_in_directory(directory: &str) -> Result<Vec<String>, String> {
    let entries =
        fs::read_dir(directory).map_err(|error| format!("无法读取目标文件夹：{error}"))?;
    let mut files = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|error| format!("无法读取目标文件夹内容：{error}"))?;
        let file_type = entry
            .file_type()
            .map_err(|error| format!("无法读取文件类型：{error}"))?;

        if file_type.is_file() {
            files.push(entry.path().to_string_lossy().into_owned());
        }
    }

    files.sort_by_cached_key(|path| path.to_lowercase());
    Ok(files)
}

pub fn preview_rename(items: Vec<RenameItemInput>) -> Vec<RenamePreviewItem> {
    let mut candidates = items
        .into_iter()
        .map(|item| {
            let source_path = Path::new(&item.source_path);
            let target_path = source_path
                .parent()
                .unwrap_or_else(|| Path::new(""))
                .join(&item.target_name)
                .to_string_lossy()
                .into_owned();
            let source_name = source_path
                .file_name()
                .and_then(|name| name.to_str())
                .unwrap_or_default();
            let invalid = invalid_target_name(&item.target_name);
            let unchanged = invalid.is_none() && item.target_name == source_name;

            RenameCandidate {
                target_key: target_path.to_lowercase(),
                source_path: item.source_path,
                target_path,
                status: if invalid.is_some() {
                    RenamePreviewStatus::Invalid
                } else if unchanged {
                    RenamePreviewStatus::Unchanged
                } else {
                    RenamePreviewStatus::Ready
                },
                error: invalid,
            }
        })
        .collect::<Vec<_>>();

    let target_counts = candidates
        .iter()
        .filter(|candidate| candidate.error.is_none())
        .fold(HashMap::<String, usize>::new(), |mut counts, candidate| {
            *counts.entry(candidate.target_key.clone()).or_default() += 1;
            counts
        });

    for candidate in &mut candidates {
        if candidate.error.is_some() || matches!(candidate.status, RenamePreviewStatus::Unchanged) {
            continue;
        }

        if target_counts
            .get(&candidate.target_key)
            .copied()
            .unwrap_or_default()
            > 1
        {
            candidate.status = RenamePreviewStatus::Conflict;
            candidate.error = Some("多个文件生成了相同的目标文件名".to_owned());
        } else if Path::new(&candidate.target_path).exists() {
            candidate.status = RenamePreviewStatus::Conflict;
            candidate.error = Some("目标文件已存在".to_owned());
        }
    }

    candidates
        .into_iter()
        .map(|candidate| RenamePreviewItem {
            source_path: candidate.source_path,
            target_path: candidate.target_path,
            status: candidate.status,
            error: candidate.error,
        })
        .collect()
}

fn invalid_target_name(name: &str) -> Option<String> {
    if name.trim().is_empty() {
        return Some("文件名不能为空".to_owned());
    }

    if name == "."
        || name == ".."
        || name.chars().any(|character| {
            matches!(
                character,
                '\\' | '/' | ':' | '*' | '?' | '"' | '<' | '>' | '|'
            )
        })
    {
        return Some("文件名包含非法字符".to_owned());
    }

    None
}
