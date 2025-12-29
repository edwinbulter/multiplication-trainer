package ebulter.multiply

import android.app.Application
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import ebulter.multiply.data.AppDatabase
import ebulter.multiply.data.ScoreRepository

class ViewModelFactory(private val application: Application) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(PracticeViewModel::class.java)) {
            val scoreDao = AppDatabase.getDatabase(application).scoreDao()
            val repository = ScoreRepository(scoreDao)
            @Suppress("UNCHECKED_CAST")
            return PracticeViewModel(repository) as T
        }
        if (modelClass.isAssignableFrom(ScoreboardViewModel::class.java)) {
            val scoreDao = AppDatabase.getDatabase(application).scoreDao()
            val repository = ScoreRepository(scoreDao)
            @Suppress("UNCHECKED_CAST")
            return ScoreboardViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}