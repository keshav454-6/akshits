APP_CATEGORY_PERMISSIONS = {
    "flashlight": {
        "expected": [],
        "description": "Simple utility tool that controls the LED torch light."
    },
    "calculator": {
        "expected": [],
        "description": "Basic arithmetic math application requiring zero network or hardware sensors."
    },
    "camera_photo": {
        "expected": ["camera", "files_storage"],
        "description": "Photo/video capture and image editing application."
    },
    "video_call_conferencing": {
        "expected": ["camera", "microphone", "notifications"],
        "description": "Live audio/video communication client."
    },
    "navigation_maps": {
        "expected": ["location", "notifications"],
        "description": "Turn-by-turn routing and GPS navigation service."
    },
    "social_media": {
        "expected": ["camera", "microphone", "files_storage", "notifications"],
        "description": "Social networking application with media upload and messaging features."
    },
    "ecommerce_shopping": {
        "expected": ["notifications", "location"],
        "description": "Online storefront requiring delivery address resolution and order updates."
    },
    "generic_utility": {
        "expected": ["notifications"],
        "description": "General purpose utility application."
    }
}

PERMISSION_DEFINITIONS = {
    "camera": {
        "name": "Camera Access",
        "purpose": "Allows application to capture live video stream and photographs.",
        "privacy_risk": "Severe: Potential for unauthorized visual surveillance or background photo capture.",
        "inherent_risk_weight": 25
    },
    "microphone": {
        "name": "Microphone / Audio Recording",
        "purpose": "Enables recording ambient sound, conversations, and audio notes.",
        "privacy_risk": "Severe: Acoustic eavesdropping and continuous conversational voice capture.",
        "inherent_risk_weight": 25
    },
    "location": {
        "name": "Precise GPS / Location",
        "purpose": "Tracks geographic coordinates and physical user movements.",
        "privacy_risk": "High: Persistent location profiling, tracking daily routines, workplace and home addresses.",
        "inherent_risk_weight": 20
    },
    "contacts": {
        "name": "Read / Access Contacts Book",
        "purpose": "Retrieves names, phone numbers, and emails of all saved personal and professional contacts.",
        "privacy_risk": "High: Contact siphoning used for predatory spam, social engineering, and blackmail.",
        "inherent_risk_weight": 25
    },
    "files_storage": {
        "name": "Internal Storage & Media Files",
        "purpose": "Access to local photos, documents, and downloaded media files.",
        "privacy_risk": "High: Unauthorized indexing of private photos, confidential PDF documents, and financial receipts.",
        "inherent_risk_weight": 15
    },
    "notifications": {
        "name": "Push Notifications",
        "purpose": "Displays alerts, status reminders, and marketing banners in notification shade.",
        "privacy_risk": "Low / Moderate: Can be abused for clickbait advertising, persistent nagging, or spam.",
        "inherent_risk_weight": 5
    },
    "background_access": {
        "name": "Unrestricted Background Execution",
        "purpose": "Permits the app to run services and transmit data when closed or screen is turned off.",
        "privacy_risk": "High: Silent background telemetry, location polling, and excessive battery drain.",
        "inherent_risk_weight": 20
    },
    "sms_call_logs": {
        "name": "SMS & Call History Access",
        "purpose": "Allows reading received text messages and dialing records.",
        "privacy_risk": "Critical: Interception of Two-Factor Authentication OTPs and private bank confirmation SMS.",
        "inherent_risk_weight": 35
    }
}

def analyze_permissions(app_category: str, selected_permissions: list, source_type: str = "manual") -> dict:
    """
    Evaluates whether requested permissions align with legitimate functionality.
    Flags excessive or malicious over-privilege.
    """
    category_key = (app_category or "generic_utility").lower()
    cat_info = APP_CATEGORY_PERMISSIONS.get(category_key, APP_CATEGORY_PERMISSIONS["generic_utility"])
    expected_perms = set(cat_info["expected"])

    audited_permissions = []
    excessive_permissions = []
    risk_score = 0

    for perm_key in selected_permissions:
        perm_meta = PERMISSION_DEFINITIONS.get(perm_key, {
            "name": perm_key.replace('_', ' ').title(),
            "purpose": "Device hardware or subsystem access.",
            "privacy_risk": "Moderate: Access to system capabilities.",
            "inherent_risk_weight": 10
        })

        is_necessary = perm_key in expected_perms
        if not is_necessary:
            # Over-privileged permission
            excessive_permissions.append(perm_meta["name"])
            risk_score += perm_meta["inherent_risk_weight"] * 1.5
            necessity_status = "Unjustified / Excessive"
            recommendation = f"Revoke immediately. A {category_key.replace('_', ' ')} does not reasonably require this permission to operate."
        else:
            risk_score += (perm_meta["inherent_risk_weight"] * 0.3)
            necessity_status = "Standard / Justified"
            recommendation = "Acceptable for core application functionality. Monitor usage in app settings."

        audited_permissions.append({
            "key": perm_key,
            "name": perm_meta["name"],
            "purpose": perm_meta["purpose"],
            "privacy_risk": perm_meta["privacy_risk"],
            "status": necessity_status,
            "is_excessive": not is_necessary,
            "recommendation": recommendation
        })

    # Normalized risk score
    normalized_score = min(int(risk_score), 100)

    if normalized_score >= 65:
        risk_level = "Severe Over-Privilege Risk"
    elif normalized_score >= 35:
        risk_level = "Moderate Privacy Exposure"
    elif normalized_score > 0:
        risk_level = "Low Risk / Appropriate Scope"
    else:
        risk_level = "Zero Permissions Granted"

    return {
        "app_category": category_key,
        "category_description": cat_info["description"],
        "source_type": source_type,
        "is_browser_retrieved": source_type == "browser_sensor",
        "total_requested": len(selected_permissions),
        "excessive_count": len(excessive_permissions),
        "risk_score": normalized_score,
        "risk_level": risk_level,
        "excessive_permissions": excessive_permissions,
        "permissions_audit": audited_permissions,
        "transparency_disclaimer": "CyberShield distinguishes between manually audited app profiles and live browser permission probes. In-browser web applications cannot arbitrarily modify third-party Android/iOS system permissions without native OS settings intervention."
    }

