use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ApplicationCategory {
    Document,
    File,
    Media,
    Network,
    System,
    Utility,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ApplicationStatus {
    Available,
    Disabled,
    Unavailable,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApplicationManifest {
    pub key: String,
    pub name: String,
    pub category: ApplicationCategory,
    pub description: String,
    pub entry: String,
    pub link: String,
    pub status: ApplicationStatus,
    pub queueable: bool,
}
