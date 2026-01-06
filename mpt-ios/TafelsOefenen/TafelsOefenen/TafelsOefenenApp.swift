//
//  TafelsOefenenApp.swift
//  TafelsOefenen
//
//  Created by E.G.H. Bulter on 04/01/2026.
//

import SwiftUI

@main
struct TafelsOefenenApp: App {
    @StateObject private var appState = AppState()
    
    init() {
        // Disable keyboard haptic feedback to avoid simulator warnings
        UITextField.appearance().tintColor = .systemBlue
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
        }
    }
}
