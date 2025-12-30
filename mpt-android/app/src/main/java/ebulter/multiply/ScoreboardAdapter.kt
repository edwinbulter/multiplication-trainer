package ebulter.multiply

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import ebulter.multiply.data.Score
import ebulter.multiply.databinding.FragmentScoreboardBinding
import ebulter.multiply.databinding.ItemScoreBinding
import java.text.SimpleDateFormat
import java.util.*

class ScoreboardAdapter : ListAdapter<Score, ScoreboardAdapter.ScoreViewHolder>(ScoreDiffCallback()) {

    private var originalList: List<Score> = emptyList()
    private var currentSortOrder: SortOrder = SortOrder.NONE

    enum class SortOrder {
        NONE, TABLE_ASC, TABLE_DESC, DURATION_ASC, DURATION_DESC, DATETIME_ASC, DATETIME_DESC
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ScoreViewHolder {
        val binding = ItemScoreBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ScoreViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ScoreViewHolder, position: Int) {
        val score = getItem(position)
        holder.binding.tableText.text = score.table
        holder.binding.durationText.text = "${score.duration / 1000}"

        // Format date as dd/MM/yy HH:mm
        val sdf = SimpleDateFormat("dd/MM/yy HH:mm", Locale.getDefault())
        holder.binding.datetimeText.text = sdf.format(Date(score.timestamp))
    }

    fun submitListWithOriginal(list: List<Score>?) {
        originalList = list ?: emptyList()
        submitList(list)
    }

    fun sortByTable() {
        currentSortOrder = when (currentSortOrder) {
            SortOrder.TABLE_ASC -> SortOrder.TABLE_DESC
            else -> SortOrder.TABLE_ASC
        }
        performSort()
    }

    fun sortByDuration() {
        currentSortOrder = when (currentSortOrder) {
            SortOrder.DURATION_ASC -> SortOrder.DURATION_DESC
            else -> SortOrder.DURATION_ASC
        }
        performSort()
    }

    fun sortByDateTime() {
        currentSortOrder = when (currentSortOrder) {
            SortOrder.DATETIME_ASC -> SortOrder.DATETIME_DESC
            else -> SortOrder.DATETIME_ASC
        }
        performSort()
    }

    private fun performSort() {
        val sortedList = when (currentSortOrder) {
            SortOrder.TABLE_ASC -> originalList.sortedBy { 
                it.table.replace(',', '.').toDoubleOrNull() ?: Double.MAX_VALUE 
            }
            SortOrder.TABLE_DESC -> originalList.sortedByDescending { 
                it.table.replace(',', '.').toDoubleOrNull() ?: Double.MIN_VALUE 
            }
            SortOrder.DURATION_ASC -> originalList.sortedBy { it.duration }
            SortOrder.DURATION_DESC -> originalList.sortedByDescending { it.duration }
            SortOrder.DATETIME_ASC -> originalList.sortedBy { it.timestamp }
            SortOrder.DATETIME_DESC -> originalList.sortedByDescending { it.timestamp }
            else -> originalList
        }
        submitList(sortedList)
    }

    class ScoreViewHolder(val binding: ItemScoreBinding) : RecyclerView.ViewHolder(binding.root)

    class ScoreDiffCallback : DiffUtil.ItemCallback<Score>() {
        override fun areItemsTheSame(oldItem: Score, newItem: Score): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Score, newItem: Score): Boolean {
            return oldItem == newItem
        }
    }
}