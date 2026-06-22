package dev.beefers.vendetta.manager.installer.step.download

import android.content.Context
import androidx.compose.runtime.Stable
import dev.beefers.vendetta.manager.R
import dev.beefers.vendetta.manager.domain.manager.PreferenceManager
import dev.beefers.vendetta.manager.installer.step.Step
import dev.beefers.vendetta.manager.installer.step.StepGroup
import dev.beefers.vendetta.manager.installer.step.StepRunner
import org.koin.core.component.inject
import java.io.File

@Stable
class DownloadVendettaStep(
    workingDir: File
) : Step() {

    private val context: Context by inject()
    private val preferenceManager: PreferenceManager by inject()

    override val group: StepGroup = StepGroup.DL
    override val nameRes = R.string.step_dl_vd

    val destination = preferenceManager.moduleLocation
    val workingCopy = workingDir.resolve("xposed.apk")

    override suspend fun run(runner: StepRunner) {
        runner.logger.i("Copying bundled CloudCord module")
        destination.parentFile?.mkdirs()
        workingCopy.parentFile?.mkdirs()

        context.assets.open("cloudcord-module.apk").use { input ->
            destination.outputStream().use { output ->
                input.copyTo(output)
            }
        }

        if (!destination.exists()) {
            error("Bundled module copy is missing: ${destination.absolutePath}")
        }

        if (destination.length() <= 0) {
            error("Bundled module copy is empty: ${destination.absolutePath}")
        }

        destination.copyTo(workingCopy, overwrite = true)

        if (!workingCopy.exists()) {
            error("Working module copy is missing: ${workingCopy.absolutePath}")
        }

        if (workingCopy.length() <= 0) {
            error("Working module copy is empty: ${workingCopy.absolutePath}")
        }

        progress = 1f
    }

}
