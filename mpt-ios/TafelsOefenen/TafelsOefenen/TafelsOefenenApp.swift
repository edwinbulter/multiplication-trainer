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
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
        }
    }
}
