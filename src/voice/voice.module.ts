import { Module } from "@nestjs/common";
import { VoiceGeteway } from "./voice.geteway";


@Module({
  providers: [VoiceGeteway]
})
export class VoiceModule {}