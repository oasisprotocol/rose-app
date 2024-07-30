import { execSync } from 'child_process'

export abstract class DockerUtils {
  private static getOasisContainerName() {
    const cmd = "docker ps --format '{{.Names}}' --filter status=running --filter expose=8545"
    const name = new TextDecoder().decode(execSync(cmd))
    return name.replace(/\n|\r/g, '')
  }

  /**
   * Dependency: jq - make sure jq cli tool is installed
   * @param dockerName
   * @private
   */
  private static getOasisContainerDebondingInterval(dockerName: string) {
    const cmd = `docker exec ${dockerName} cat /serverdir/node/fixture.json | jq .network.staking_genesis.params.debonding_interval`
    return Number.parseInt(new TextDecoder().decode(execSync(cmd)))
  }

  private static setOasisContainerEpoch(dockerName: string, epoch: number) {
    const cmd = `docker exec ${dockerName} /oasis-node debug control set-epoch --epoch ${epoch} -a unix:/serverdir/node/net-runner/network/client-0/internal.sock`
    execSync(cmd)
  }

  static getOasisContainerEpoch(dockerName: string = DockerUtils.getOasisContainerName()) {
    const cmd = `docker exec ${dockerName} /oasis-node control status -a unix:/serverdir/node/net-runner/network/client-0/internal.sock  | jq '.consensus.latest_epoch'`
    return Number.parseInt(new TextDecoder().decode(execSync(cmd)))
  }

  static oasisContainerSkipEpochs(args: { nEpochs?: number; dockerName?: string; targetEpoch?: number }) {
    let { nEpochs, dockerName, targetEpoch } = args
    dockerName = dockerName || DockerUtils.getOasisContainerName()
    nEpochs = nEpochs || DockerUtils.getOasisContainerDebondingInterval(dockerName)
    let currentEpoch = DockerUtils.getOasisContainerEpoch(dockerName)
    targetEpoch = targetEpoch || currentEpoch + nEpochs
    const stride = 1
    while (currentEpoch < targetEpoch) {
      currentEpoch += stride
      if (currentEpoch >= targetEpoch) {
        currentEpoch = targetEpoch
      }
      DockerUtils.setOasisContainerEpoch(dockerName, currentEpoch)
    }
  }
}
